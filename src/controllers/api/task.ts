import * as express from 'express';
import { TaskManager } from '../../domain/taskApi';
import { isNullOrUndefined } from 'util';

export class TaskAPIController {
    private taskManager: TaskManager;

    constructor() {
        this.taskManager = new TaskManager();
    }

    public createTask(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.taskManager.createTask(req.body.description, (err, newTask) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(newTask);
        });
    }

    public getAllTasks(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.taskManager.getAllTasks((err, tasks) => {
            if (err) {
                return next(err);
            }

            const result = {'tasks': tasks}
            res.status(200).json(result);
        });
    }

    public getTaskById(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.taskManager.getTaskById(req.params.id, (err, task) => {
            let code = 200;
            if (err) {
                return next(err);
            }

            if (isNullOrUndefined(task)) {
                code = 404;
                test = undefined;
            }

            res.status(code).json(task);
        });
    }
}