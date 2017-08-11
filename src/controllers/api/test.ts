import * as express from 'express';
import { TestManager } from '../../domain/testApi';
import { isNullOrUndefined } from 'util';


export class TestAPIController {
    private testManager: TestManager;

    constructor() {
        this.testManager = new TestManager();
    }

    public createTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this.testManager.createTest(req.body.candidateId, req.body.examId, (err, newTest) => {
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
}