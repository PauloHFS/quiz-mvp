import express from 'express';
import rateLimit from 'express-rate-limit';
import { validateZodSchema } from '../../middlewares/validateZodSchema';
import { login, logout, refreshToken, signup } from './controllers';
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  signupSchema,
} from './validations';

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), login);
AuthRouter.post('/logout', validateZodSchema(logoutSchema), logout);
AuthRouter.post('/signup', validateZodSchema(signupSchema), signup);
AuthRouter.post(
  '/refresh-token',
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validateZodSchema(refreshTokenSchema),
  refreshToken
);

export { AuthRouter };
