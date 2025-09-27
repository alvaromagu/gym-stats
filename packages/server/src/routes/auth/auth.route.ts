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
      const optionsJSON = await userCreator.execute({
        email: req.body.email,
        fullName: req.body.fullName,
      });
      res.status(httpStatus.CREATED).json(optionsJSON);
    },
  );

  const verifyRegisterSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('registrationResponse').exists().isObject(),
  ];
  const userRegistrationVerifier = container.get('userRegistrationVerifier');

  router.post(
    '/auth/verify-register',
    verifyRegisterSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const { email, registrationResponse } = req.body;
      const result = await userRegistrationVerifier.execute({
        email,
        registrationResponse,
      });
      res.status(httpStatus.OK).json(result);
    },
  );

  const authOptsSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];
  const authOptsCreator = container.get('authOptsCreator');

  router.post(
    '/auth/generate-authentication-options',
    authOptsSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const { email } = req.body;
      const options = await authOptsCreator.execute({ email });
      res.status(httpStatus.OK).json(options);
    },
  );

  const authVerifySchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('authResponse').exists().isObject(),
  ];
  const authVerifier = container.get('authVerifier');

  router.post(
    '/auth/verify-authentication',
    authVerifySchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const { email, authResponse } = req.body;
      const result = await authVerifier.execute({
        email,
        authResponse,
      });
      res.status(httpStatus.OK).json(result);
    },
  );
};
