import * as express from 'express';
import * as uuid from 'uuid';
import * as fs from 'fs';
import EXAM_DATA from '../data/test-data.mock';

const STATUS = {
    CREATED: 1,
    RUNNING: 2,
    COMPLETE: 3,
    TIMEOUT: 4
};


const DEFAULT_TIME = 50;

interface TestInfo {
    id: string;
    created: number;
    startTime: number;
    endTime: number;
    timer: number;
    status: number;
}


export class TestController {
    private tests: any;
    private timer: any;

    constructor() {
        this.tests = {};
    }

    public home(req: express.Request, res: express.Response, next: express.NextFunction) {
          res.render('test', {
            title: 'Tests'
          });
    }

    public createTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = uuid.v1();
        const lang = req.query.lang;
        this.tests[id] = {
            id: id,
            created: Date.now(),
            startTime: undefined,
            endTime: undefined,
            timer: undefined,
            currentTime: DEFAULT_TIME,
            status: STATUS.CREATED
        };
          res.render('test/test', {
            title: 'Tests',
            id: id,
            lang: lang
          });
    }

    public startTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.body.testId;

        if (this.start(id)) {

            res.render('test/testForm', {
                title: 'Test Form',
                id: id,
                test: this.getTestData()
            });

        } else {
            res.send('Unable to start test. Check the test exist and is not started or completed');
        }
    }

    public testHomeById(req: express.Request, res: express.Response, next: express.NextFunction) {
          const id = req.query.id;
          const testInfo = this.tests[id];
          if (testInfo && testInfo.status === STATUS.CREATED) {
            res.render('test/testHomeById', {
                title: 'Tests',
                id: id
            });
          } else {
              res.send('Unable to start test. Check the test exist and is not started or completed');
          }
    }

    public startTestById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.body.testId;

        if (this.start(id)) {

            res.render('test/testFormById', {
                title: 'Test Form',
                id: id,
                test: this.getTestData()
            });

        } else {
            res.send('Unable to start test. Check the test exist and is not started or completed');
        }
    }

    public completeTestById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.body.testId;
        let status = '';
        if (this.complete(id)) {
            status = 'Test completed';
        } else {
            status = 'unable to complete the test. Check the test is running and the timer is not finished';
        }

        res.render('test/testCompleteById', {
            title: 'Test Finished',
            id: id,
            status: status

        });
    }

    private start(id: string) {
        // Get test info
        const testInfo = this.tests[id];

        if (testInfo && testInfo.status === STATUS.CREATED) {
            // Start timer (is not running)
            this.timer = setInterval(() => {
                this.updateTime();
            }, 1000);

            testInfo.startTime = Date.now();
            testInfo.status = STATUS.RUNNING;

            return true;

        }

        return false;
    }

    private complete(id: string) {
        const testInfo = this.tests[id];
        if (testInfo && testInfo.status === STATUS.RUNNING && testInfo.status !== STATUS.TIMEOUT) {
            testInfo.status = STATUS.COMPLETE;
            testInfo.endTime = Date.now();
            return true;
        }
        return false;
    }

    private updateTime() {
        console.log('UPDATING TIME !');
        let testsRunning: boolean = false;
        // TODO implement stop interval if no test is active.
        Object.keys(this.tests).forEach((key: any) => {
            if (this.tests[key].status === STATUS.RUNNING) {
                this.tests[key].currentTime--;
                if (this.tests[key].currentTime < 0) {
                    this.tests[key].status = STATUS.TIMEOUT;
                }
                testsRunning = true;
            }
        });

        if (!testsRunning) {
            console.log('TIMER STOPED');
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    private getTestData(): any {
        // TBD Retrieve this data from db.
        return EXAM_DATA;
    }

    public completeTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.body.testId;
        const test = this.tests[id];
        let status = '';
        if (test && test.status === STATUS.RUNNING && test.status !== STATUS.TIMEOUT) {
            // clearInterval(this.timer);
            test.status = STATUS.COMPLETE;
            test.endTime = Date.now();
            status = 'Test completed';
        } else {
            status = 'unable to complete the test. Check the test is running and the timer is not finished';
        }

        res.render('test/complete', {
            title: 'Test Finished',
            id: id,
            status: status
        });


    }

    public getAllTests(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json(this.tests);
    }

    public getTestById(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json(this.tests[req.params.id]);
    }


}