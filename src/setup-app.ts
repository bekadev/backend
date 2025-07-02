import express, { Express, Request, Response } from 'express';
import {setupSwagger} from "./core/swagger/setup-swagger";
import {driversRouter} from "./drivers/routers/drivers.router";
import {testingRouter} from "./testing/routers/testing.router";

export const setupApp = (app: Express) => {
	app.use(express.json());

	app.get('/', (req: Request, res: Response) => {
		res.status(200).send('hello world!!!');
	});

	app.use('/api/drivers', driversRouter);
	app.use('/api/testing', testingRouter);

	setupSwagger(app);

	return app;
};