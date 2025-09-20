import httpStatus from 'http-status';
import type { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { validateReqSchema } from '..';
import { container } from '@/di';

export const register = (router: Router): void => {
  const registerSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('fullName').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  const userCreator = container.get('userCreator');

  router.post(
    '/auth/register',
    registerSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      try {
        const id = await userCreator.execute({
          email: req.body.email,
          fullName: req.body.fullName,
        });
        res.status(httpStatus.CREATED).json({ id });
      } catch (error) {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal Server Error' });
      }
    },
  );
};
