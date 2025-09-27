import httpStatus from 'http-status';
import type { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { getToken, validateReqSchema } from '..';
import { container } from '@/di';
import { authMiddleware } from './middlewares';

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

  router.post(
    '/auth/logout',
    authMiddleware,
    async (req: Request, res: Response) => {
      const sessionCloser = container.get('sessionCloser');
      const token = getToken(req);
      if (token != null) {
        await sessionCloser.execute({ token });
      }
      res.status(httpStatus.NO_CONTENT).send();
    },
  );

  router.get(
    '/auth/me',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const userFinder = container.get('userFinder');
      const user = await userFinder.execute({ id: req.user.userId });
      res.status(httpStatus.OK).json(user);
    },
  );

  const updateUserSchema = [
    body('fullName')
      .optional()
      .isString()
      .notEmpty({ ignore_whitespace: true }),
  ];

  router.patch(
    '/auth/me',
    authMiddleware,
    updateUserSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const userUpdater = container.get('userUpdater');
      const { fullName } = req.body;
      await userUpdater.execute({
        id: req.user.userId,
        fullName,
      });
      res.status(httpStatus.NO_CONTENT).send();
    },
  );
};
