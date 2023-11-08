import bycript from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prismaClient } from '../../database/index.js';
import {
  loginSchema,
  refreshTokenSchema,
  signupSchema,
} from './validations.js';

const refreshTokens: string[] = [];

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = loginSchema.parse(req);

    const user = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const { password, ...userData } = user;

    const passwordMatch = await bycript.compare(body.password, password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const accessToken = jwt.sign(userData, env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(userData, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const session = await prismaClient.session.create({
      data: {
        refreshToken,
        user: {
          connect: {
            id: userData.id,
          },
        },
      },
    });

    return res.json({ accessToken, refreshToken: session.refreshToken });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { body } = refreshTokenSchema.parse(req);

    refreshTokens.filter(token => token !== body.refreshToken);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { body } = signupSchema.parse(req);

    const hashedPassword = await bycript.hash(body.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: body.nome,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { body } = refreshTokenSchema.parse(req);

    if (!refreshTokens.includes(body.refreshToken)) {
      return res.status(403).json({ message: 'Refresh Token inválido' });
    }

    const decoded = jwt.verify(body.refreshToken, env.JWT_SECRET);

    const accessToken = jwt.sign(decoded, env.JWT_SECRET);

    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
