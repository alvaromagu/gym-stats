import type { Server } from '@/server';
import { container } from '@/di';

container
  .register()
  .then(async () => {
    const server = container.get<Server>('server');
    await server.start();
  })
  .catch((error: unknown) => {
    console.error('Error registering Dependency Injection container:', error);
    process.exit(1);
  });
