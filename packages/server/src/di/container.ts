import {
  createContainer,
  type AwilixContainer,
  InjectionMode,
  asClass,
  asValue,
} from 'awilix';
import { ConsoleLogger } from '../contexts/shared/infra/console-logger.js';
import { config } from '../contexts/shared/infra/config-loader.js';
import {
  createSupaClient,
  type SupaClient,
} from '../contexts/shared/infra/persistance/supa-client.js';
import type { UserRepository } from '../contexts/auth/domain/user-repository.js';
import { SupaUserRepository } from '../contexts/auth/infra/supa-user-repository.js';
import type { Logger } from '../contexts/shared/domain/logger.js';
import type { Config } from '../contexts/shared/domain/config.js';
import { UserCreator } from '../contexts/auth/app/user-creator.js';
import { UserRegistrationVerifier } from '../contexts/auth/app/user-registration-verifier.js';
import { AuthVerifier } from '../contexts/auth/app/auth-verifier.js';
import { AuthOptsCreator } from '../contexts/auth/app/auth-opts-creator.js';
import type { TokenRepository } from '../contexts/auth/domain/token-repository.js';
import { SupaTokenRepository } from '../contexts/auth/infra/supa-token-repository.js';
import { SessionCloser } from '../contexts/auth/app/session-closer.js';
import { UserUpdater } from '../contexts/auth/app/user-updater.js';
import { UserFinder } from '../contexts/auth/app/user-finder.js';
import { CredentialRemover } from '../contexts/auth/app/credential-remover.js';
import { CredentialFinder } from '../contexts/auth/app/credential-finder.js';
import { CredentialVerifier } from '../contexts/auth/app/credential-verifier.js';
import { CredentialRequestCreator } from '../contexts/auth/app/credential-request-creator.js';
import type { CredentialRequestRepository } from '../contexts/auth/domain/credential-request-repository.js';
import { SupaCredentialRequestRepository } from '../contexts/auth/infra/supa-credential-request-repository.js';
import { CredentialRequestOptionsCreator } from '../contexts/auth/app/credential-request-options-creator.js';
import { CredentialRequestOptionsVerifier } from '../contexts/auth/app/credential-request-options-verifier.js';
import { CredentialRequestRemover } from '../contexts/auth/app/credential-request-remover.js';
import { SupaExerciseRepository } from '../contexts/workout/infra/supa-exercise-repository.js';
import { SupaWorkoutRepository } from '../contexts/workout/infra/supa-workout-repository.js';
import type { SetRepository } from '../contexts/workout/domain/set-repository.js';
import type { ExerciseRepository } from '../contexts/workout/domain/exercise-repository.js';
import type { WorkoutRepository } from '../contexts/workout/domain/workout-repository.js';
import { WorkoutCreator } from '../contexts/workout/app/workout-creator.js';
import { WorkoutUpdater } from '../contexts/workout/app/workout-updater.js';
import { WorkoutRemover } from '../contexts/workout/app/workout-remover.js';
import { ExerciseCreator } from '../contexts/workout/app/exercise-creator.js';
import { ExerciseUpdater } from '../contexts/workout/app/exercise-updater.js';
import { ExerciseRemover } from '../contexts/workout/app/exercise-remover.js';
import { SetRemover } from '../contexts/workout/app/set-remover.js';
import { SupaSetRepository } from '../contexts/workout/infra/supa-set-repository.js';
import { WorkoutFinder } from '../contexts/workout/app/workout-finder.js';
import { WorkoutDetailFinder } from '../contexts/workout/app/workout-detail-finder.js';
import type { ExerciseDetailFinder } from '../contexts/workout/app/exercise-detail-finder.js';

interface Dependencies {
  logger: Logger;
  config: Config;
  supaClient: SupaClient;
  userRepository: UserRepository;
  tokenRepository: TokenRepository;
  credentialRequestRepository: CredentialRequestRepository;
  userCreator: UserCreator;
  userRegistrationVerifier: UserRegistrationVerifier;
  authOptsCreator: AuthOptsCreator;
  authVerifier: AuthVerifier;
  sessionCloser: SessionCloser;
  userUpdater: UserUpdater;
  userFinder: UserFinder;
  credentialFinder: CredentialFinder;
  credentialRemover: CredentialRemover;
  credentialVerifier: CredentialVerifier;
  credentialRequestCreator: CredentialRequestCreator;
  credentialRequestOptionsCreator: CredentialRequestOptionsCreator;
  credentialRequestOptionsVerifier: CredentialRequestOptionsVerifier;
  credentialRequestRemover: CredentialRequestRemover;

  workoutRepository: WorkoutRepository;
  exerciseRepository: ExerciseRepository;
  setRepository: SetRepository;
  workoutCreator: WorkoutCreator;
  workoutUpdater: WorkoutUpdater;
  workoutRemover: WorkoutRemover;
  workoutFinder: WorkoutFinder;
  workoutDetailFinder: WorkoutDetailFinder;
  exerciseCreator: ExerciseCreator;
  exerciseUpdater: ExerciseUpdater;
  exerciseRemover: ExerciseRemover;
  exerciseDetailFinder: ExerciseDetailFinder;
  setRemover: SetRemover;
}

export class Container {
  private readonly container: AwilixContainer<Dependencies> =
    createContainer<Dependencies>({
      injectionMode: InjectionMode.CLASSIC,
    });

  async register(): Promise<void> {
    const supaClient = await createSupaClient(config);

    this.container.register({
      logger: asClass(ConsoleLogger).singleton(),
      config: asValue(config),
      supaClient: asValue(supaClient),
      userRepository: asClass<UserRepository>(SupaUserRepository).singleton(),
      tokenRepository:
        asClass<TokenRepository>(SupaTokenRepository).singleton(),
      credentialRequestRepository: asClass<CredentialRequestRepository>(
        SupaCredentialRequestRepository,
      ).singleton(),
      userCreator: asClass(UserCreator).singleton(),
      userRegistrationVerifier: asClass(UserRegistrationVerifier).singleton(),
      authOptsCreator: asClass(AuthOptsCreator).singleton(),
      authVerifier: asClass(AuthVerifier).singleton(),
      sessionCloser: asClass(SessionCloser).singleton(),
      userUpdater: asClass(UserUpdater).singleton(),
      userFinder: asClass(UserFinder).singleton(),
      credentialFinder: asClass(CredentialFinder).singleton(),
      credentialRemover: asClass(CredentialRemover).singleton(),
      credentialVerifier: asClass(CredentialVerifier).singleton(),
      credentialRequestCreator: asClass(CredentialRequestCreator).singleton(),
      credentialRequestOptionsCreator: asClass(
        CredentialRequestOptionsCreator,
      ).singleton(),
      credentialRequestOptionsVerifier: asClass(
        CredentialRequestOptionsVerifier,
      ).singleton(),
      credentialRequestRemover: asClass(CredentialRequestRemover).singleton(),

      workoutRepository: asClass<WorkoutRepository>(
        SupaWorkoutRepository,
      ).singleton(),
      exerciseRepository: asClass<ExerciseRepository>(
        SupaExerciseRepository,
      ).singleton(),
      setRepository: asClass<SetRepository>(SupaSetRepository).singleton(),
      workoutCreator: asClass(WorkoutCreator).singleton(),
      workoutUpdater: asClass(WorkoutUpdater).singleton(),
      workoutRemover: asClass(WorkoutRemover).singleton(),
      workoutFinder: asClass(WorkoutFinder).singleton(),
      exerciseCreator: asClass(ExerciseCreator).singleton(),
      exerciseUpdater: asClass(ExerciseUpdater).singleton(),
      exerciseRemover: asClass(ExerciseRemover).singleton(),
      workoutDetailFinder: asClass(WorkoutDetailFinder).singleton(),
      setRemover: asClass(SetRemover).singleton(),
    });
  }

  get<T extends keyof Dependencies>(name: T): Dependencies[T] {
    return this.container.resolve(name);
  }
}
