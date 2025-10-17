import { body } from 'express-validator';
import { authMiddleware } from '../auth/middlewares.js';
import type { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { container } from '@/di/index.js';

export const registerWorkoutRoutes = (router: Router): void => {
  router.use('/workouts', authMiddleware);

  const workoutCreateSchema = [
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('date').exists().isISO8601(),
  ];

  router.post(
    '/workouts',
    workoutCreateSchema,
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

  const workoutUpdateSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('name').exists().isString().notEmpty({ ignore_whitespace: true }),
    body('date').exists().isISO8601(),
    body('notes').optional({ nullable: true }).isString(),
  ];

  router.put(
    '/workouts',
    workoutUpdateSchema,
    async (req: Request, res: Response) => {
      const workoutUpdater = container.get('workoutUpdater');
      const { id, name, date, notes } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await workoutUpdater.execute({ id, userId, name, date, notes });
      res.status(204).send();
    },
  );

  const workoutDeleteSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.delete(
    '/workouts',
    workoutDeleteSchema,
    async (req: Request, res: Response) => {
      const workoutRemover = container.get('workoutRemover');
      const { id } = req.body;
      const userId = req.user?.userId;
      if (userId == null) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      await workoutRemover.execute({ id, userId });
      res.status(204).send();
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

  const setDeleteSchema = [
    body('id').exists().isString().notEmpty({ ignore_whitespace: true }),
  ];

  router.delete(
    '/workouts/sets',
    setDeleteSchema,
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
