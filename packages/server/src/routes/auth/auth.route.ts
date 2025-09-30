import httpStatus from 'http-status';
import type { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { getToken, validateReqSchema } from '../index.js';
import { container } from '../../di/index.js';
import { authMiddleware } from './middlewares.js';
import type { Details } from 'express-useragent';

function userAgentToDeviceName(ua: Details): string {
  const platform = ua.platform ?? 'Unknown Platform';
  const os = ua.os ?? 'N/A';
  const browser = ua.browser ?? 'Unknown Browser';
  let deviceType = 'Desktop';
  if (ua.isMobile) deviceType = 'Phone';
  else if (ua.isTablet) deviceType = 'Tablet';
  else if (ua.isBot) deviceType = 'Bot';
  return `${browser} | ${os} (${platform}) | ${deviceType}`;
}

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
    '/auth/verify-register',
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
        deviceName:
          req.useragent == null
            ? 'unknown'
            : userAgentToDeviceName(req.useragent),
      });
      res.status(httpStatus.OK).json(result);
    },
  );

  const authOptsSchema = [
    body('email').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.post(
    '/auth/generate-authentication-options',
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
    '/auth/verify-authentication',
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
};
