import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import itemsRoutes from './routes/items';
import usersRoutes from './routes/users';

import './strategies/steamStrategy';

const app = express();
const PORT = process.env.PORT || 3000;

// cors confing
const whitelist = process.env.WHITELISTED_ORIGINS as unknown as Array<string>;

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, succes?: boolean) => void,
  ) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const mongoDB = process.env.MONGODB_URL as string;
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB);

// routes
app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
