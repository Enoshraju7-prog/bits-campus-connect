import { createServer } from 'http';
import app from './app';
import { initSocket } from './socket';

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.info(`API server running on http://localhost:${PORT}`);
});
