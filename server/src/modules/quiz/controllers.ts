import { Request, Response } from 'express';
import { prismaClient } from '../../database/index.js';
import { createNewQuizSchema } from './validations.js';

export const listAllQuizes = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const take = Number(req.query.take);
    const skip = Number(req.query.skip);
    // todo: add cursor

    const quizes = await prismaClient.quiz.findMany({
      where: {
        userId: user.id,
      },
      take,
      skip,
    });

    return res.json(quizes);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const quizId = Number(req.params.id);

    const quiz = await prismaClient.quiz.findUnique({
      where: {
        id: quizId,
        userId: user.id,
      },
      include: {
        Question: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    return res.json(quiz);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createNewQuiz = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const {
      body: { nome, questoes },
    } = createNewQuizSchema.parse(req);

    const quiz = await prismaClient.quiz.create({
      data: {
        name: nome,
        Question: {
          create: questoes.map(({ titulo, alternativas, correctIndex }) => ({
            title: titulo,
            alternatives: alternativas,
            correctIndex,
          })),
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    return res.status(400).json(error);
  }
};