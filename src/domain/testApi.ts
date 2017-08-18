import { default as Test } from '../models/Test';
import { default as Exam } from '../models/Exam';
import { default as TestResponses } from '../models/TestResponses';

const STATUS = {
    CREATED: 'CREATED',
    SENT: 'SENT',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
    TIMEOUT: 'TIMEOUT'
};

const DEFAULT_TEST_TIME = 50;

export class TestManager {

    private runningTests: any;
    private timer: any;

    constructor() {
        this.runningTests = {};
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

        test.save( (err: any) => {
            done(err, test);
        });
    }

    public getAllTests(done: (err: any, tests: any) => void) {

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

    public getTestTasks(testId: string, done: (err: any, test: any) => void) {

        let tasks: any = undefined;

        // TODO: Fix these multiple calls to done()!
        Test.findById(testId, (err1, test: any) => {

            if (test) {

                console.log('Exam id: ' + test.examId);

                Exam.findById(test.examId, (err2, exam: any) => {
                    if (err2 && err2.name === 'CastError') {
                        // Ignore this error since exam will be undefined anyways
                    }

                    if (exam) {
                        tasks = exam.tasks;
                        done(err1, tasks);
                    }
                    else {
                        err1 = {name: 'ExamNotFound'};
                        done(err1, undefined);
                    }
                }).populate('tasks');
            }
            else {
                err1 = {name: 'TestNotFound'};
                done(err1, undefined);
            }
        });
    }

    public submitTestResponses(testId: string, responses: any[], done: (err: any, testResponses: any) => void) {

        this.getTestResponses(testId, (err, testResponses) => {
            if (testResponses) {
                testResponses.responses = responses;
                testResponses.submitDate = Date.now();

                testResponses.save( (err: any) => {
                    done(err, testResponses);
                });
            }
            else {
                const testResponses = new TestResponses({
                    testId: testId,
                    responses: responses,
                    submitDate: Date.now()
                });

                testResponses.save( (err: any) => {
                    done(err, testResponses);
                });
            }
        });
    }

    public getTestResponses(testId: string, done: (err: any, testResponses: any) => void) {

        Test.findById(testId, (err, test: any) => {
            if (test) {
                TestResponses.findOne({testId: testId}, (err, testResponses: any) => {
                    if (err && err.name === 'CastError') {
                        err = undefined;
                    }

                    done(err, testResponses);
                });
            }
            else {
                err = {name: 'TestNotFound'};
                done(err, undefined);
            }
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
                    test.startedDate = Date.now();
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

    public completeTest(testId: string, done: (err: any, test: any) => void) {
        this.getTestById(testId, (err, test) => {
            if (test) {
                console.log('got test: ' + test);
                if (test.status === STATUS.RUNNING) {
                    test.status = STATUS.COMPLETED;
                    test.finishedDate = Date.now();
                    test.remainingTime = 0;
                    delete this.runningTests[testId];

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
                    this.runningTests[key].finishedDate = Date.now();
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