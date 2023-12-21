import { Task } from "./task";

export interface TaskService {
    addTask(text: string): Task;
    getById(id: number): Task | null;
    getAllTasks(): Task[];
    updateTask(id: number, text: string): Task | null;
    deleteTask(id: number): void;
}