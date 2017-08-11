import { default as Test } from '../models/Test';

const STATUS = {
    CREATED: 'CREATED',
    SENT: 'SENT',
    RUNNING: 'RUNNING',
    COMPLETE: 'COMPLETED',
    TIMEOUT: 'TIMEOUT'
};

export class TestManager {
    constructor() {
    }

    public createTest(candidateId: string, examId: string, done: (err: any, test: any) => void) {

        const test = new Test({
            status: STATUS.CREATED,
            candidateId: candidateId,
            examId: examId,
            createdDate: Date.now()
        });

        test.save( (err) => {
            done(err, test);
        });
    }

    public getAllTests(done: (err: any, test: any) => void) {

        Test.find({ }, (err, tests) => {
            done(err, tests);
        });
    }

    public getTestById(testId: string, done: (err: any, test: any) => void) {

        Test.findById(testId, (err, test) => {
            if (err && err.name === 'CastError') {
                err = undefined;
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
}