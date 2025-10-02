import httpStatus from 'http-status';
import type { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { getToken, validateReqSchema } from '../index.js';
import { container } from '../../di/index.js';
import { authMiddleware } from './middlewares.js';

export const registerAuthRoutes = (router: Router): void => {
  const registerSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('fullName').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.post(
    '/auth/register',
    registerSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const userCreator = container.get('userCreator');
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

  router.post(
    '/auth/register/verify',
    verifyRegisterSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const userRegistrationVerifier = container.get(
        'userRegistrationVerifier',
      );

      const { email, registrationResponse } = req.body;
      const result = await userRegistrationVerifier.execute({
        email,
        registrationResponse,
        deviceName: req.deviceName ?? 'unknown',
      });
      res.status(httpStatus.OK).json(result);
    },
  );

  const authOptsSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.post(
    '/auth/auth-options/generate',
    authOptsSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const authOptsCreator = container.get('authOptsCreator');
      const { email } = req.body;
      const options = await authOptsCreator.execute({ email });
      res.status(httpStatus.OK).json(options);
    },
  );

  const authVerifySchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('authResponse').exists().isObject(),
  ];

  router.post(
    '/auth/auth-options/verify',
    authVerifySchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const authVerifier = container.get('authVerifier');

      const { email, authResponse } = req.body;
      const result = await authVerifier.execute({
        email,
        authResponse,
      });
      res.status(httpStatus.OK).json(result);
    },
  );

  router.post(
    '/auth/me/logout',
    authMiddleware,
    async (req: Request, res: Response) => {
      const sessionCloser = container.get('sessionCloser');
      const token = getToken(req);
      if (token == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await sessionCloser.execute({ token, userId: undefined });
      res.status(httpStatus.NO_CONTENT).send();
    },
  );

  router.post(
    '/auth/me/logout/all',
    authMiddleware,
    async (req: Request, res: Response) => {
      const sessionCloser = container.get('sessionCloser');
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await sessionCloser.execute({ userId, token: undefined });
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

  router.get(
    '/auth/me/credentials',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialFinder = container.get('credentialFinder');
      const credentials = await credentialFinder.execute({
        userId: req.user.userId,
      });
      res.status(httpStatus.OK).json(credentials);
    },
  );

  router.delete(
    '/auth/me/credentials/:credentialId',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialId = req.params.credentialId;
      if (credentialId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialRemover = container.get('credentialRemover');
      await credentialRemover.execute({
        userId: req.user.userId,
        credentialId,
      });
      res.status(httpStatus.NO_CONTENT).send();
    },
  );

  router.post(
    '/auth/me/credentials/:credentialId/verify',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialId = req.params.credentialId;
      if (credentialId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialVerifier = container.get('credentialVerifier');
      await credentialVerifier.execute({
        userId: req.user.userId,
        credentialId,
      });
      res.status(httpStatus.NO_CONTENT).send();
    },
  );

  router.post(
    '/auth/me/credential-request',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialRequestCreator = container.get(
        'credentialRequestCreator',
      );
      const result = await credentialRequestCreator.execute({
        userId: req.user.userId,
      });
      res.status(httpStatus.OK).json(result.toPrimitives());
    },
  );

  router.delete(
    '/auth/me/credential-request',
    authMiddleware,
    async (req: Request, res: Response) => {
      if (req.user == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const credentialRequestRemover = container.get(
        'credentialRequestRemover',
      );
      await credentialRequestRemover.execute({
        userId: req.user.userId,
      });
      res.status(httpStatus.NO_CONTENT).send();
    },
  );

  const createCredentialRequestOptionsSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.post(
    '/auth/credential-request/options/generate',
    createCredentialRequestOptionsSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const credentialRequestOptionsCreator = container.get(
        'credentialRequestOptionsCreator',
      );
      const optionsJSON = await credentialRequestOptionsCreator.execute({
        id: req.body.id,
      });
      res.status(httpStatus.OK).json(optionsJSON);
    },
  );

  const verifyCredentialRequestOptionsSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('registrationResponse').exists().isObject(),
  ];

  router.post(
    '/auth/credential-request/options/verify',
    verifyCredentialRequestOptionsSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const credentialRequestOptionsVerifier = container.get(
        'credentialRequestOptionsVerifier',
      );

      const { id, registrationResponse } = req.body;
      const result = await credentialRequestOptionsVerifier.execute({
        id,
        registrationResponse,
        deviceName: req.deviceName ?? 'unknown',
      });
      res.status(httpStatus.OK).json(result);
    },
  );
};
