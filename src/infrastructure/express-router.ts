import { Router } from 'express';
import { TaskController } from '../task/task.controller';
import { TaskRouter } from '../task/task.router';
import { TaskService } from '../task/task.service';

export class ExpressRouter {
    router = Router();

    private taskController!: TaskController;
    private taskRouter!: TaskRouter;

    constructor(private taskService: TaskService) {
        this.configureControllers();
        this.configureRouters();
        this.configureRoutes();
    }

    private configureControllers(): void {
        this.taskController = new TaskController(this.taskService);
    }

    private configureRouters(): void {
        this.taskRouter = new TaskRouter(this.taskController);
    }

    private configureRoutes(): void {
        this.router.use('/task', this.taskRouter.router);
    }
}