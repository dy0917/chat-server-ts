import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { initSocket } from './sockets';
import { dbConnect } from './dbConnection';
import router from './routes';

const main = async () => {
    const app = express();
    app.use(express.json());
    await dbConnect();
    const PORT = process.env.PORT || 5000;

    app.use(cors());

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
      
        // Handle different types of errors and send an appropriate response
        res.status(500).json({ error: 'Something went wrong!' });
      });

    const http = initSocket(app);

    app.get('/', (req:Request, res:Response) => {
        res.send(`Server env:${ process.env.NODE_ENV} is up and running`);
    });

    app.use('/api/v1',router)

    http.listen(PORT, () => {
        console.log(`Listening to ${PORT}`);
    });
};

main();
