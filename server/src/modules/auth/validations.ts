import z from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email - Inválido'),
    password: z
      .string()
      .min(6, 'password precisa ter no mínimo 6 caracteres')
      .max(100, 'password precisa ter no máximo 100 caracteres'),
  }),
});

export const signupSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(2, 'nome precisa ter no mínimo 2 caracteres')
      .max(100, 'nome precisa ter no máximo 100 caracteres'),
    email: z.string().email('Email - Inválido'), //TODO - verificar se o email já existe
    password: z
      .string()
      .min(6, 'password precisa ter no mínimo 6 caracteres')
      .max(100, 'password precisa ter no máximo 100 caracteres'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string(),
  }),
});
