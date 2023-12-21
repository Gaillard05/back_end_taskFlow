import fs from 'fs';
import { Task } from './task';
import { TaskJSONService } from './task.json-service';

jest.mock('fs');
const fsMock = fs as jest.Mocked<typeof fs>;

describe('TaskJSONService', () => {
    let sut: TaskJSONService;

    beforeEach(() => {
        sut = new TaskJSONService();
        jest.resetAllMocks();
    });

    describe('addTask', () => {
        it('should throw an error when given text points to an existing task', () => {
            const existingTexts = 'text';
            const tasks: Task[] = [new Task(0, existingTexts)];
            stubReadFileSync(tasks);

            expect(() => sut.addTask(existingTexts)).toThrow();
        });

        it('should override tasks with an array containing given new task', () => {
            const tasks: Task[] = [
                new Task(0, 'text_28'),
                new Task(1, 'text_910'),
            ];
            stubReadFileSync(tasks);

            const taskToCreate = new Task(2, 'username_03');

            sut.addTask(taskToCreate.text);

            const stringifiedTasks = JSON.stringify(tasks.concat(taskToCreate));
            expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                './src/task/tasks.json',
                stringifiedTasks,
            );
        });
    });

    describe('getById', () => {
        it('should read json file using fs module', () => {
            const tasks: Task[] = [];
            stubReadFileSync(tasks);

            sut.getById(0);

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.readFileSync).toHaveBeenCalledWith(
                './src/task/tasks.json',
            );
        });

        it('should return null when no user has been found', () => {
            const tasks: Task[] = [];
            stubReadFileSync(tasks);

            const result = sut.getById(0);

            expect(result).toBeNull();
        });

        it('should return the right Text when it has been found using given id', () => {
            const tasks: Task[] = [new Task(0, 'text')];
            stubReadFileSync(tasks);

            const result = sut.getById(tasks[0].id);

            expect(result).toEqual(tasks[0]);
        });
    });
});

function stubReadFileSync(tasks: Task[]): void {
    const stringifiedTasks = JSON.stringify(tasks);
    const dummyBuffer = Buffer.from(stringifiedTasks);

    fsMock.readFileSync.mockReturnValueOnce(dummyBuffer);
}