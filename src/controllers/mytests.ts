import * as express from 'express';

class MyTestsController {
    constructor() {
    }

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
          res.render('mytests', {
            title: 'My Tests'
          });
    }
}

export const myTestsController = new MyTestsController();
