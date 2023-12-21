import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import { ExpressRouter } from './express-router';

export class ExpressServer {
    private express = express();

    constructor(
        private allowedMainOrigin: string,
        private expressRouter: ExpressRouter,
        private port: string,
    ) {
        this.configureServer();
    }

    bootstrap(): void {
        this.express.listen(this.port, () => {
            console.log(`> Listening on port ${this.port}`);
        });
    }

    private configureServer(): void {
        this.configureCorsPolicy();
        this.configureBodyParser();
        this.configureRoutes();
    }

    private configureCorsPolicy(): void {
        const corsOptions: CorsOptions = {
            origin: (origin, callback) => {
                // Autoriser toutes les origines (temporaire)
                // Remplacez cela par votre logique d'autorisation réelle
                callback(null, true);
            },
            // Autoriser les méthodes nécessaires
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            // Autoriser les en-têtes nécessaires
            allowedHeaders: 'Content-Type,Authorization',
        };

        this.express.use(cors(corsOptions));
    }

    private configureBodyParser(): void {
        this.express.use(bodyParser.json());
    }

    private configureRoutes(): void {
        this.express.use('/api', this.expressRouter.router);
    }
}