import * as express from 'express';
import * as uuid from 'uuid';
import * as fs from 'fs';
import EXAM_DATA from '../data/test-data.mock';

const STATUS = {
    CREATED: 'CREATED',
    SENT: 'SENT',
    RUNNING: 'RUNNING',
    COMPLETE: 'COMPLETED',
    TIMEOUT: 'TIMEOUT'
};


const DEFAULT_TIME = 50;

interface TestInfo {
    id: string;
    created: number;
    sent: number;
    started: number;
    completed: number;
    countdown: number;
    status: string;
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

    public testList(req: express.Request, res: express.Response, next: express.NextFunction) {
          res.render('test/tests', {
            title: 'Tests',
            tests: this.tests
          });
    }

    // TODO Move to the exam module
    public examList(req: express.Request, res: express.Response, next: express.NextFunction) {
          const lang = req.query.lang;
          // TODO This should be get from DB (Mock for now)
          const exams = [
              {
                  id: '#EXAM1',
                  name: 'Exam1',
                  desc: 'This is the exam 1'
              },
              {
                  id: '#EXAM2',
                  name: 'Exam2',
                  desc: 'This is the exam 2'
              },
              {
                  id: '#EXAM3',
                  name: 'Exam3',
                  desc: 'This is the exam 3'
              },

          ];
          res.render('test/exams', {
            title: 'Exams',
            lang: lang,
            exams: exams
          });
    }

    public createTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = uuid.v1();
        const lang = req.body.lang;
        this.tests[id] = {
            id: id,
            created: Date.now(),
            started: undefined,
            sent: undefined,
            completed: undefined,
            countdown: DEFAULT_TIME,
            status: STATUS.CREATED
        };
          res.render('test/created', {
            title: 'Tests',
            id: id,
            lang: lang
          });
    }

    public testHome(req: express.Request, res: express.Response, next: express.NextFunction) {
          const id = req.query.id;
          const testInfo = this.tests[id];
          if (testInfo && testInfo.status === STATUS.SENT) {
            res.render('test/testHomeById', {
                title: 'Tests',
                id: id
            });
          } else {
              res.send('Unable to start test. Check the test exist and is not started or completed');
          }
    }

    public sendTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.body.testId;
        // Get test info
        const testInfo = this.tests[id];

        if (testInfo && testInfo.status === STATUS.CREATED) {
            testInfo.sent = Date.now();
            testInfo.status = STATUS.SENT;
            res.render('test/sent', {
                title: 'Test Sent',
                id: id
            });

        } else {
            res.send('Unable to send test. Check the test exist and is not started or completed');
        }
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

        if (testInfo && testInfo.status === STATUS.SENT) {
            // Start timer (is not running)
            this.timer = setInterval(() => {
                this.updateTime();
            }, 1000);

            testInfo.started = Date.now();
            testInfo.status = STATUS.RUNNING;

            return true;

        }

        return false;
    }

    private complete(id: string) {
        const testInfo = this.tests[id];
        if (testInfo && testInfo.status === STATUS.RUNNING && testInfo.status !== STATUS.TIMEOUT) {
            testInfo.status = STATUS.COMPLETE;
            testInfo.completed = Date.now();
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
                this.tests[key].countdown--;
                if (this.tests[key].countdown < 0) {
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
            test.status = STATUS.COMPLETE;
            test.completed = Date.now();
            status = 'Test completed';
        } else {
            status = 'unable to complete the test. Check the test is running and the timer is not finished';
        }

        res.render('test/completed', {
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