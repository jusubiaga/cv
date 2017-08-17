import { default as Exam } from '../models/Exam';

export class ExamManager {

    public createExam(topic: string, tasks: string[], done: (err: any, task: any) => void) {

        const exam = new Exam({
            topic: topic,
            tasks: tasks
        });

        exam.save( (err) => {
            done(err, exam);
        });
    }

    public getAllExams(done: (err: any, exams: any) => void) {

        Exam.find({ }, (err, exams) => {
            done(err, exams);
        });
    }

    public getExamById(examId: string, done: (err: any, task: any) => void) {

        Exam.findById(examId, (err, exam) => {
            if (err && err.name === 'CastError') {
                err = undefined;
            }

            done(err, exam);
        });
    }
}