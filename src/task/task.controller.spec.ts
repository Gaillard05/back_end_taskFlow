import { Task } from './task';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
    let sut: TaskController;
    let taskService: TaskServiceSpy;

    beforeEach(() => {
        taskService = new TaskServiceSpy();
        sut = new TaskController(taskService);
    });

    describe('addTask', () => {
        it('should throw an error when given task is empty', () => {
            const texts: string[] = ['', ' ', '     '];

            for (const text of texts) {
                expect(() => sut.addTask(text)).toThrow();
            }
        });

        it('should call add from TaskService when given text is valid', () => {
            const validTexts: string[] = ['text_1', 'us', 'test'];

            for (const validText of validTexts) {
                sut.addTask(validText);
            }

            expect(taskService.callsToAdd).toBe(validTexts.length);
        });
    });

    describe('getById', () => {
        it('should throw an error when given id is not a number', () => {
            const ids = [NaN, '28', ''];

            for (const id of ids) {
                expect(() => sut.getById(id as number)).toThrow();
            }
        });

        it('should throw an error when given id is a decimal', () => {
            const ids: number[] = [0.4, 11.993, 2.7];

            for (const id of ids) {
                expect(() => sut.getById(id)).toThrow();
            }
        });

        it('should throw an error when given id is negative', () => {
            const ids: number[] = [-1, -3, -482];

            for (const id of ids) {
                expect(() => sut.getById(id)).toThrow();
            }
        });

        it('should call getById on TaskService when given id is valid', () => {
            const validIds: number[] = [0, 31, 838, 4];

            for (const validId of validIds) {
                sut.getById(validId);
            }

            expect(taskService.callsToGetById).toBe(validIds.length);
        });
    });

    describe('updateTask', () => {
        it('should call updateTask on TaskService with valid parameters', () => {
            const taskId = 42;
            const newText = 'Updated Text';

            sut.updateTask(taskId, newText);
            expect(taskService.callsToUpdateTask).toBe(1);
            expect(taskService.lastUpdateTaskId).toBe(taskId);
            expect(taskService.lastUpdateTaskText).toBe(newText);
        });
    });

    describe('deleteTask', () => {
        it('should call deleteTask on TaskService with valid parameter', () => {
            const taskId = 42;

            sut.deleteTask(taskId);
            expect(taskService.callsToDeleteTask).toBe(1);
            expect(taskService.lastDeleteTaskId).toBe(taskId);
        });
    });
});

class TaskServiceSpy implements TaskService {
    callsToAdd = 0;
    callsToGetById = 0;
    callsToGetAllTasks = 0;
    callsToUpdateTask = 0;
    callsToDeleteTask = 0;

    private dummyTask = new Task(0, '');

    lastUpdateTaskId: number | undefined;
    lastUpdateTaskText: string | undefined;

    lastDeleteTaskId: number | undefined;

    addTask(text: string): Task {
        this.callsToAdd++;
        return this.dummyTask;
    }

    getById(id: number): Task | null {
        this.callsToGetById++;
        return this.dummyTask;
    }

    getAllTasks(): Task[] {
        this.callsToGetAllTasks++;
        // Retourne un tableau factice pour les tests
        return [new Task(1, 'Task 1'), new Task(2, 'Task 2')];
    }

    updateTask(id: number, text: string): Task | null {
        this.callsToUpdateTask++;
        this.lastUpdateTaskId = id;
        this.lastUpdateTaskText = text;
        // Retourne une tâche factice pour les tests
        return new Task(id, text);
    }

    deleteTask(id: number): void {
        this.callsToDeleteTask++;
        this.lastDeleteTaskId = id;
    }
}