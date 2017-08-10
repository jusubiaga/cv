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

        test.save(function (err) {
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
            if (err && err.name == 'CastError') {
                err = undefined;
            }
            done(err, test);
        });
    }
}