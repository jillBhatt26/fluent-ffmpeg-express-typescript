import 'reflect-metadata';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from '@config/env.config';
import { errorMiddleware } from '@middleware/error.middleware';
import { appRoutes } from '@routes/app.routes';

const app: Application = express();

// cors config
app.use(
    cors({
        origin: '*', // NOTE: Since this a backend only app, wildcard '*' character is used. Replace it with the client URL based on NODE_ENV
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    })
);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app routes and error middleware
app.use('/api', appRoutes);
app.use(errorMiddleware);
app.use((_: Request, res: Response, __: NextFunction) => {
    return res.status(404).json({
        success: false,
        message: 'Invalid route requested!'
    });
});

// listen
app.listen(PORT, () => {
    console.log(`🚀🚀🚀...Server exposed on PORT: ${PORT}...🚀🚀🚀`);
});
