import * as express from 'express';
import { TestManager } from '../../domain/testApi';
import { isNullOrUndefined } from 'util';


export class TestAPIController {
    private testManager: TestManager;

    constructor() {
        this.testManager = new TestManager();
    }

    public createTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.createTest(req.body.candidateId, req.body.examId, req.body.allowedTime, (err, newTest) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(newTest);
        });
    }

    public getAllTests(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.getAllTests((err, tests) => {
            if (err) {
                return next(err);
            }

            const result = {'tests': tests}
            res.status(200).json(result);
        });
    }

    public getTestById(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.getTestById(req.params.id, (err, test) => {
            let code = 200;
            if (err) {
                return next(err);
            }

            if (isNullOrUndefined(test)) {
                code = 404;
                test = undefined;
            }

            res.status(code).json(test);
        });
    }

    public getTestTasks(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.getTestTasks(req.params.id, (err, tasks) => {
            let code = 200;
            let body = undefined;
            if (err) {
                if (err.name === 'TestNotFound') {
                    code = 404;
                    body = {message: 'Test not found'};
                }
                else if (err.name === 'ExamNotFound') {
                    code = 409;
                    body = {message: 'Test exam not found'};
                }
                else {
                    return next(err);
                }
            }
            else {
                body = {tasks: tasks};
            }

            res.status(code).json(body);
        });
    }

    public submitTestResponses(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.submitTestResponses(req.params.id, req.body.responses, (err, testResponses) => {
            if (err) {
                return next(err);
            }
            res.status(200).json(testResponses);
        });
    }

    public getTestResponses(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.getTestResponses(req.params.id, (err, testResponses) => {
            let code = 200;
            let body = undefined;
            if (err) {
                if (err.name === 'TestNotFound') {
                    code = 404;
                    body = {message: 'Test not found'};
                }
                else {
                    return next(err);
                }
            }
            else {
                body = {testResponses: testResponses};
            }

            res.status(code).json(body);
        });
    }

    public sendTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.sendTest(req.params.id, (err, test) => {
            let code = 200;
            let body = test;

            if (err) {
                if (err.name === 'TestNotFound') {
                    code = 404;
                    body = {message: 'Test not found'};
                }
                else if (err.name === 'TestInvalidState') {
                    code = 409;
                    body = {message: 'Test was already sent'};
                }
                else {
                    return next(err);
                }
            }

            res.status(code).json(body);
        });
    }

    public startTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.startTest(req.params.id, (err, test) => {
            let code = 200;
            let body = test;

            if (err) {
                if (err.name === 'TestNotFound') {
                    code = 404;
                    body = {message: 'Test not found'};
                }
                else if (err.name === 'TestInvalidState') {
                    code = 409;
                    body = {message: 'Test not in SENT state'};
                }
                else {
                    return next(err);
                }
            }

            res.status(code).json(body);
        });
    }

    public completeTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.completeTest(req.params.id, (err, test) => {
            let code = 200;
            let body = test;

            if (err) {
                if (err.name === 'TestNotFound') {
                    code = 404;
                    body = {message: 'Test not found'};
                }
                else if (err.name === 'TestInvalidState') {
                    code = 409;
                    body = {message: 'Test not in RUNNING state'};
                }
                else {
                    return next(err);
                }
            }

            res.status(code).json(body);
        });
    }
}