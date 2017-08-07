import * as express from 'express';
import * as uuid from 'uuid';
import * as fs from 'fs';

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
            timestamp: undefined,
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
        console.log(__dirname);
        // const filepath = __dirname + '/data/java.test.json';
        // const data = fs.readFileSync(filepath);
        // return JSON.parse(data);


       const obj = {
    'testId': 1,
    'language': 'JAVA',
    'questions': [

        {
            'id': 1,
            'question': 'Given an array of  integers, can you find the sum of its elements?',
            'code': `
import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;

public class Solution {

    static int simpleArraySum(int n, int[] ar) {
        // Complete this function
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] ar = new int[n];
        for(int ar_i = 0; ar_i < n; ar_i++){
            ar[ar_i] = in.nextInt();
        }
        int result = simpleArraySum(n, ar);
        System.out.println(result);
    }
}`
        },

        {
            'id': 2,
            'question': 'question2',
            'code': 'this is the code for q 2'

        },

        {
            'id': 3,
            'question': 'question3',
            'code': 'this is the code for q3'

        }

    ]

};

return obj;
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