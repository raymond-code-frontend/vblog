import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import routers from './src/routers';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const DB_CONNECTION = process.env.DB_CONNECTION!;
const PORT = process.env.PORT!;
app.use(cors());
try {
  mongoose.set('strictQuery', true);
  mongoose.connect(DB_CONNECTION);
  console.log('\x1b[34m⚡️[database]: Database connected \x1b[0m');
} catch (error) {
  console.log('\x1b[31m⚡️[database]: Unexpected Error \x1b[0m');
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/auth', routers.authRouter);

app.listen(PORT, () => {
  console.log(`\x1b[33m⚡️[server]: Server is running at http://127.0.0.1:${PORT} \x1b[0m`);
});
