import { areSameStrings, isArrayEmpty } from '../utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Task } from "./task";
import { TaskService } from "./task.service";

const DEFAULT_TASK_ID = 1;

export class TaskJSONService implements TaskService {

    private readonly taskJsonPath = './src/task/tasks.json';

    constructor() {
        this.writeDefaultTasksJsonFile();
    }

    addTask(text: string): Task {
        const tasks = this.getTasksFromJsonFile();

        this.throwWhenTextExists(tasks, text);

        const newId = this.generateUniqueId(tasks);
        const newTask = new Task(newId, text);

        tasks.push(newTask);
        this.overrideTasks(tasks);

        return newTask;

    }

    getById(id: number): Task | null {
        const tasks = this.getTasksFromJsonFile();

        const existingTasks = tasks.find((task) => task.id == id);
        return existingTasks || null;
    }

    getAllTasks(): Task[] {
        // Lire le contenu du fichier json et le parser en tant que tableau
        const tasksData = readFileSync(this.taskJsonPath, 'utf-8');
        const tasks: Task[] = JSON.parse(tasksData);
        return tasks;
    }

    updateTask(id: number, text: string): Task | null {
        // Lire le contenu du fichier JSON et le parser en tant que tableau de tâches
        const tasksData = readFileSync(this.taskJsonPath, 'utf-8');
        const tasks: Task[] = JSON.parse(tasksData);

        // Trouver et mettre à jour la tâche par ID
        const updatedTaskIndex = tasks.findIndex(task => task.id === id);
        if (updatedTaskIndex !== -1) {
            tasks[updatedTaskIndex].text = text;

            // Écrire le tableau de tâches mis à jour dans le fichier JSON
            writeFileSync(this.taskJsonPath, JSON.stringify(tasks, null, 2), 'utf-8');

            return tasks[updatedTaskIndex];
        }

        return null;
    }
    
    deleteTask(id: number): void {
         // Lire le contenu du fichier JSON et le parser en tant que tableau de tâches
        const tasksData = readFileSync(this.taskJsonPath, 'utf-8');
        const tasks: Task[] = JSON.parse(tasksData);

         // Filtrer les tâches pour exclure celle avec l'ID spécifié
        const filteredTasks = tasks.filter(task => task.id !== id);

         // Écrire le tableau de tâches filtré dans le fichier JSON
        writeFileSync(this.taskJsonPath, JSON.stringify(filteredTasks, null, 2), 'utf-8');
    }


    private writeDefaultTasksJsonFile(): void {
        if (!existsSync(this.taskJsonPath)) {
            writeFileSync(this.taskJsonPath, JSON.stringify([]));
        }
    }


    private getTasksFromJsonFile(): Task[] {
        const buffer = readFileSync(this.taskJsonPath);
        const tasks = JSON.parse(buffer.toString()) as Task[];
        return tasks;
    }

    private throwWhenTextExists(tasks: Task[], text: string): void {
        const textAlreadyExists = tasks.some((task) =>
            areSameStrings(task.text, text),
        );
        if (textAlreadyExists) {
            throw new Error(
                `Given text "${text}" points to an existing tasks.`,
            );
        }
    }

    private generateUniqueId(tasks: Task[]): number {
        if (isArrayEmpty(tasks)) {
            return DEFAULT_TASK_ID;
        }

        const taskIds = tasks.map((task) => task.id);
        return Math.max(...taskIds) + 1;
    }

    private overrideTasks(tasks: Task[]): void {
        writeFileSync(this.taskJsonPath, JSON.stringify(tasks));
    }

}