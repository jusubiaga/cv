import * as express from 'express';
import * as uuid from 'uuid';


const STATUS = {
    CREATED: 1,
    RUNNING: 2,
    COMPLETE: 3,
    TIMEOUT: 4
};


const DEFAULT_TIME = 30;

interface TestInfo {
    id: string;
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

    public createTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = uuid.v1();
        this.tests[id] = {
            id: id,
            timestamp: undefined,
            timer: undefined,
            currentTime: DEFAULT_TIME,
            status: STATUS.CREATED
        };
        res.send(`generate test: ${id}`);
    }

    public startTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.query.id;
        const test = this.tests[id];
        if (test && test.status === STATUS.CREATED) {

            // Start timer (is not running)
            this.timer = setInterval(() => {
                this.updateTime();
            }, 1000);

            test.startTime = Date.now();
            test.status = STATUS.RUNNING;
            res.send('Test Running');
        } else {
            res.send('Unable to start test. Check the test exist and is not started or completed');
        }
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

    public completeTest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.query.id;
        const test = this.tests[id];
        if (test && test.status === STATUS.RUNNING && test.status !== STATUS.TIMEOUT) {
            // clearInterval(this.timer);
            test.status = STATUS.COMPLETE;
            test.endTime = Date.now();
            res.send('Test completed');
        } else {
            res.send('unable to complete the test. Check the test is running and the timer is not finished');
        }

    }

    public getAllTests(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json(this.tests);
    }

    public getTestById(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json(this.tests[req.params.id]);
    }


}