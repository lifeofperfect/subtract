import {rateLimit, ipKeyGenerator} from "express-rate-limit";

// The library exports SECOND/MINUTE/HOUR constants, but they are deprecated
// as of v8 and change in the next major version, so define them here.
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const tooMany = (message) => (req, res) => res.status(429).json({success: false, error: message});

// Baseline for every endpoint. Generous enough that a real user never sees it,
// low enough to blunt scraping and runaway client loops.
export const apiLimiter = rateLimit({
    windowMs: 15 * MINUTE,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: tooMany('Too many requests, please try again later'),
});

// Sign in is the expensive route: every attempt costs a bcrypt compare.
// Keyed on IP *and* email so one attacker cannot lock a victim out of their
// own account, and successful logins are not counted against the allowance.
export const signInLimiter = rateLimit({
    windowMs: 15 * MINUTE,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email ?? ''}`,
    handler: tooMany('Too many failed sign in attempts, please try again in 15 minutes'),
});

// Sign up creates rows and burns a bcrypt hash, so it is capped per IP.
export const signUpLimiter = rateLimit({
    windowMs: 1 * HOUR,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: tooMany('Too many accounts created from this address, please try again later'),
});
