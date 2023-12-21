import { ExpressRouter } from "./express-router";
import { ExpressServer } from "./express-server";
import { TaskJSONService } from "../task/task.json-service";
import { TaskService } from "../task/task.service";
import * as dotenv from 'dotenv';

export class ExpressApplication {
    private allowedMainOrigin!: string;
    private expressRouter!: ExpressRouter;
    private port!: string;
    private server!: ExpressServer;
    private taskService!: TaskService;
 
    constructor() {
        this.configureApplication();
    }

    boostrap(): void {
        this.server.bootstrap();
    }

    private configureApplication(): void {
        this.configureEnvironment();
        this.configureVariables();
        this.configureServerPort();
        this.configureServices();
        this.configureExpressRouter();
        this.configureServer();
    }

    private configureEnvironment(): void {
        dotenv.config({
            path: '.env.template'
        });
    }

    private configureVariables(): void {
        this.configureAllowedMainOrigin();
        this.configureServerPort();
    }


    private configureAllowedMainOrigin(): void {
        this.allowedMainOrigin = this.getAllowedMainOrigin();
    }

    private getAllowedMainOrigin(): string {
        const allowedMainOrigin = process.env.ALLOWED_MAIN_ORIGIN;
        if (!allowedMainOrigin) {
            throw new Error('No allowed main origin was found in env file.');
        }

        return allowedMainOrigin;
    }


    private configureServerPort() : void {
        this.port = this.getPort();
    }

    private getPort(): string {
        const port = process.env.PORT;

        if(!port) {
            throw new Error("No port was found in env file.");
        }

        return port;
    }

    private configureServices(): void {
        this.taskService = new TaskJSONService();
    }

    private configureExpressRouter(): void {
        this.expressRouter = new ExpressRouter(this.taskService);
    }

    private configureServer(): void {
        this.server = new ExpressServer( this.allowedMainOrigin, this.expressRouter, this.port);
    }
}