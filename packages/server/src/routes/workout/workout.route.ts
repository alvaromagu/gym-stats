import { body, param } from 'express-validator';
import { authMiddleware } from '../auth/middlewares.js';
import type { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { container } from '../../di/index.js';
import { validateReqSchema } from '../index.js';

export const registerWorkoutRoutes = (router: Router): void => {
  router.use('/workouts', authMiddleware);

  const workoutCreateSchema = [
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('date').exists().isISO8601(),
  ];

  router.post(
    '/workouts',
    workoutCreateSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const workoutCreator = container.get('workoutCreator');
      const { name, date } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const result = await workoutCreator.execute({ userId, name, date });
      res.status(201).json(result);
    },
  );

  router.get('/workouts', async (req: Request, res: Response) => {
    const workoutFinder = container.get('workoutFinder');
    const userId = req.user?.userId;
    if (userId == null) {
      return res.status(httpStatus.BAD_REQUEST).send();
    }
    const result = await workoutFinder.execute({ userId });
    res.status(200).json(result);
  });

  const workoutUpdateSchema = [
    param('id').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('date').exists().isISO8601(),
    body('notes').optional({ nullable: true }).isString(),
  ];

  router.put(
    '/workouts/:id',
    workoutUpdateSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const workoutUpdater = container.get('workoutUpdater');
      const { id } = req.params;
      const { name, date, notes } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await workoutUpdater.execute({ id, userId, name, date, notes });
      res.status(204).send();
    },
  );

  const workoutDeleteSchema = [
    param('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.delete(
    '/workouts/:id',
    workoutDeleteSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const workoutRemover = container.get('workoutRemover');
      const { id } = req.params;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await workoutRemover.execute({ id, userId });
      res.status(204).send();
    },
  );

  const workoutDetailSchema = [
    param('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.get(
    '/workouts/:id',
    workoutDetailSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const workoutDetailFinder = container.get('workoutDetailFinder');
      const { id } = req.params;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const result = await workoutDetailFinder.execute({
        workoutId: id,
        userId,
      });
      res.status(200).json(result);
    },
  );

  const exerciseCreateSchema = [
    body('workoutId').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('sets').isArray({ min: 1 }),
    body('sets.*.repetitions').exists().isInt({ min: 0 }),
    body('sets.*.weightKg').exists().isFloat({ min: 0 }),
    body('sets.*.setNumber').exists().isInt({ min: 1 }),
    body('sets.*.rpe')
      .optional({ nullable: true })
      .isFloat({ min: 0, max: 10 }),
    body('sets.*.toFailure').optional({ nullable: true }).isBoolean(),
    body('sets.*.groupId').optional({ nullable: true }).isString(),
    body('sets.*.notes').optional({ nullable: true }).isString(),
  ];

  router.post(
    '/workouts/exercises',
    exerciseCreateSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const exerciseCreator = container.get('exerciseCreator');
      const { workoutId, name, sets } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const result = await exerciseCreator.execute({
        userId,
        workoutId,
        name,
        sets,
      });
      res.status(201).json(result);
    },
  );

  const exerciseUpdateSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('sets').isArray({ min: 1 }),
    body('sets.*.id').optional({ nullable: true }).isString(),
    body('sets.*.repetitions').exists().isInt({ min: 0 }),
    body('sets.*.weightKg').exists().isFloat({ min: 0 }),
    body('sets.*.setNumber').exists().isInt({ min: 1 }),
    body('sets.*.rpe')
      .optional({ nullable: true })
      .isFloat({ min: 0, max: 10 }),
    body('sets.*.toFailure').optional({ nullable: true }).isBoolean(),
    body('sets.*.groupId').optional({ nullable: true }).isString(),
    body('sets.*.notes').optional({ nullable: true }).isString(),
  ];

  router.put(
    '/workouts/exercises',
    exerciseUpdateSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const exerciseUpdater = container.get('exerciseUpdater');
      const { id, name, sets } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await exerciseUpdater.execute({ id, userId, name, sets });
      res.status(204).send();
    },
  );

  const exerciseDeleteSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.delete(
    '/workouts/exercises',
    exerciseDeleteSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const exerciseRemover = container.get('exerciseRemover');
      const { id } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await exerciseRemover.execute({ exerciseId: id, userId });
      res.status(204).send();
    },
  );

  const exerciseDetailSchema = [
    param('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.get(
    '/workouts/exercises/:id',
    exerciseDetailSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const exerciseDetailFinder = container.get('exerciseDetailFinder');
      const { id } = req.params;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      const result = await exerciseDetailFinder.execute({
        userId,
        exerciseId: id,
      });
      res.status(200).json(result);
    },
  );

  const setDeleteSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.delete(
    '/workouts/sets',
    setDeleteSchema,
    validateReqSchema,
    async (req: Request, res: Response) => {
      const setRemover = container.get('setRemover');
      const { id } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await setRemover.execute({ setId: id, userId });
      res.status(204).send();
    },
  );
};
