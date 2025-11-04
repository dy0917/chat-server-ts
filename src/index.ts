import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { dbConnect } from './dbConnection';
import router from './routes';
import { port, nodeEnv } from './env';
import { newSocket } from './sockets';

const initApp = () => { 
   const app = express();
    app.use(express.json());
    app.use(cors());

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      // Handle different types of errors and send an appropriate response
      res.status(500).json({ error: 'Something went wrong!' });
    });
  
    app.get('/', (req: Request, res: Response) => {
      res.send(`Server env:${nodeEnv} is up and running`);
    });
  
    app.get('/dummy', (req: Request, res: Response) => {
      res.send("A dummy test route");
    });

    app.use('/api/v1', router);
    return app;
}

const app = initApp();
const http = createServer(app);
export const appSocket = newSocket(http);

const main = async (http:any) => {
  await dbConnect();
  const PORT = port || 5000;
  http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
  });
};

main(http);
