import * as express from 'express';
import { ExamManager } from '../../domain/examApi';
import { isNullOrUndefined } from 'util';

export class ExamAPIController {
    private examManager: ExamManager;

    constructor() {
        this.examManager = new ExamManager();
    }

    public createExam(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.examManager.createExam(req.body.topic, req.body.tasks, (err, newExam) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(newExam);
        });
    }

    public getAllExams(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.examManager.getAllExams((err, exams) => {
            if (err) {
                return next(err);
            }

            const result = {'exams': exams}
            res.status(200).json(result);
        });
    }

    public getExamById(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.examManager.getExamById(req.params.id, (err, exam) => {
            let code = 200;
            if (err) {
                return next(err);
            }

            if (isNullOrUndefined(exam)) {
                code = 404;
                test = undefined;
            }

            res.status(code).json(exam);
        });
    }
}