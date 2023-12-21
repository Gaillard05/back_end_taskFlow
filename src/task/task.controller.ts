import {
    isNumberDecimal,
    isNumberNegative,
    isStrictlyNaN,
    isStringEmpty,
} from '../utils';
import { Task } from './task';
import { TaskService } from './task.service';

export class TaskController {
    constructor(private  taskService: TaskService) {}

    addTask(text: string): Task {
        if (!text || text.trim() === '') {
            throw new Error('Given text is empty.');
        }

        return this.taskService.addTask(text);
    }

    getById(id: number): Task | null {
        if (!this.taskService) {
            throw new Error('TaskService n\'est pas initialisé.');
        }
    
        if (isStrictlyNaN(id)) {
            throw new Error('Given id is not a number.');
        }

        if (isNumberDecimal(id)) {
            throw new Error('Given id is a decimal.');
        }

        if (isNumberNegative(id)) {
            throw new Error('Given id is negative.');
        }

        return this.taskService.getById(id);
    }

    getAllTasks(): Task[] {
        return this.taskService.getAllTasks();
    }

    updateTask(id: number, text: string): Task | null {
        if (isStrictlyNaN(id)) {
            throw new Error('Given id is not a number.');
        }

        if (isNumberDecimal(id)) {
            throw new Error('Given id is a decimal.');
        }

        if (isNumberNegative(id)) {
            throw new Error('Given id is negative.');
        }

        if (!text || text.trim() === '') {
            throw new Error('Given text is empty.');
        }

        return this.taskService.updateTask(id, text);
    }

    deleteTask(id: number): void {
        if (isStrictlyNaN(id)) {
            throw new Error('Given id is not a number.');
        }

        if (isNumberDecimal(id)) {
            throw new Error('Given id is a decimal.');
        }

        if (isNumberNegative(id)) {
            throw new Error('Given id is negative.');
        }

        this.taskService.deleteTask(id);
    }
}