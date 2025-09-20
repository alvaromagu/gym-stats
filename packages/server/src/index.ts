import expres from 'express';
import { log } from './contexts/shared/logger.js';

const DEFAULT_PORT = 3000;

const app = expres();
const port = process.env.PORT ?? DEFAULT_PORT;

app.listen(port, () => {
  log(`Server is running on http://localhost:${port}`);
});
