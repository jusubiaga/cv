import { default as Test } from '../models/Test';

const STATUS = {
    CREATED: 'CREATED',
    SENT: 'SENT',
    RUNNING: 'RUNNING',
    COMPLETE: 'COMPLETED',
    TIMEOUT: 'TIMEOUT'
};

const DEFAULT_TEST_TIME = 50;

export class TestManager {

    private runningTests: any;
    private timer: any;

    constructor() {
        this.runningTests = {};
    }

    public createTestP(candidateId: string, examId: string, allowedTime: number) {

        const promise = new Promise((resolve, reject) => {
            const test = new Test({
                status: STATUS.CREATED,
                candidateId: candidateId,
                examId: examId,
                allowedTime: allowedTime,
                remainingTime: allowedTime,
                createdDate: Date.now()
            });

            test.save( (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });

        });
        return promise;
    }

    public createTest(candidateId: string, examId: string, allowedTime: number, done: (err: any, test: any) => void) {

        const test = new Test({
            status: STATUS.CREATED,
            candidateId: candidateId,
            examId: examId,
            allowedTime: allowedTime,
            remainingTime: allowedTime,
            createdDate: Date.now()
        });

        test.save( (err) => {
            done(err, test);
        });
    }

    public getAllTests(done: (err: any, test: any) => void) {

        Test.find({ }, (err, tests) => {
            if (!err && tests) {
                const arrayLength = tests.length;
                for (let i = 0; i < arrayLength; i++) {
                    if (this.runningTests[tests[i]._id]) {
                        tests[i] = this.runningTests[tests[i]._id];
                    }
                }
            }
            done(err, tests);
        });
    }

    public getAllTestsP() {
        const promise = new Promise((resolve, reject) => {
            Test.find({ }, (err, tests) => {
                if (err) {
                    reject (err);
                } else {
                    resolve(tests);
                    // TBD get countdown from runnngTest and add to the tests response
                }
            });
        });
        return promise;
    }

    public getTestById(testId: string, done: (err: any, test: any) => void) {

        Test.findById(testId, (err, test) => {
            if (err && err.name === 'CastError') {
                err = undefined;
            }

            if (this.runningTests[testId]) {
                test = this.runningTests[testId];
            }
            done(err, test);
        });
    }

    public sendTest(testId: string, done: (err: any, test: any) => void) {
        this.getTestById(testId, (err, test) => {
            if (test) {
                console.log('got test: ' + test);
                if (test.status === STATUS.CREATED) {
                    test.status = STATUS.SENT;
                    test.sentDate = Date.now();
                    test.save( (err: any) => {
                        if (err) {
                            console.log("Can't update test");
                        }
                    });
                }
                else {
                    err = {name: 'TestInvalidState'};
                }
            }
            else {
                err = {name: 'TestNotFound'};
            }

            done(err, test);
        });
    }

    public startTest(testId: string, done: (err: any, test: any) => void) {
        this.getTestById(testId, (err, test) => {
            if (test) {
                console.log('got test: ' + test);
                if (test.status === STATUS.SENT) {
                    test.status = STATUS.RUNNING;
                    test.startDate = Date.now();
                    this.runningTests[testId] = test;
                    this.timer = setInterval(() => {
                        this.updateTime();
                    }, 1000);

                    test.save( (err: any) => {
                        if (err) {
                            console.log("Can't update test");
                        }
                    });
                }
                else {
                    err = {name: 'TestInvalidState'};
                }
            }
            else {
                err = {name: 'TestNotFound'};
            }

            done(err, test);
        });
    }

    private updateTime() {

        console.log('UPDATING TIME !');
        let testsRunning: boolean = false;
        Object.keys(this.runningTests).forEach((key: any) => {
            if (this.runningTests[key].status === STATUS.RUNNING) {
                this.runningTests[key].remainingTime--;
                if (this.runningTests[key].remainingTime <= 0) {
                    this.runningTests[key].status = STATUS.TIMEOUT;
                    this.runningTests[key].remainingTime = 0;
                    this.runningTests[key].finishDate = Date.now();
                    this.runningTests[key].save( (err: any) => {
                        if (err) {
                            console.log("Can't update test");
                        }
                    });
                    delete this.runningTests[key];
                }
                testsRunning = true;
            }
        });

        if (!testsRunning) {
            console.log('TIMER STOPPED');
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}