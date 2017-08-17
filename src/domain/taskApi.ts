import { default as Task } from '../models/Task';

export class TaskManager {

    public createTask(description: string, done: (err: any, task: any) => void) {

        const task = new Task({
            description: description
        });

        task.save( (err) => {
            done(err, task);
        });
    }

    public getAllTasks(done: (err: any, tasks: any) => void) {

        Task.find({ }, (err, tasks) => {
            done(err, tasks);
        });
    }

    public getTaskById(taskId: string, done: (err: any, task: any) => void) {

        Task.findById(taskId, (err, task) => {
            if (err && err.name === 'CastError') {
                err = undefined;
            }

            done(err, task);
        });
    }
}