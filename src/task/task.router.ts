import { promises as fs } from 'fs';
import { Router } from 'express';
import { TaskController } from './task.controller';

export class TaskRouter {
    router = Router();

    constructor(private taskController: TaskController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        
        this.router.get('/list-task', (req, res, next) => {
            try {
                const result = this.taskController.getAllTasks();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.get('/:id', (req, res, next) => {
            try {
                const result = this.taskController.getById(
                    parseInt(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.post('/add-task', async (req, res, next) => {
            try {
                const { text } = req.body;
            
                // Chargez les tâches existantes depuis le fichier JSON
                const tasksData = await fs.readFile('./src/task/tasks.json', 'utf-8');
                const tasks = JSON.parse(tasksData);
            
                // Ajoutez la nouvelle tâche
                const newTask = { id: tasks.length + 1, text };
                tasks.push(newTask);
            
                // Enregistrez les tâches mises à jour dans le fichier JSON
                await fs.writeFile('./src/task/tasks.json', JSON.stringify(tasks, null, 2));
            
                // Répondez avec la nouvelle tâche ajoutée
                res.json(newTask);
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la tâche', error);
                res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche' });
            }
        });

        this.router.put('/update-task/:id', (req, res, next) => {
            try {
                const result = this.taskController.updateTask(parseInt(req.params.id), req.body.text);
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });
    
        this.router.delete('/delete-task/:id', (req, res, next) => {
            try {
                this.taskController.deleteTask(parseInt(req.params.id));
                res.json({ message: 'Task deleted successfully' });
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}