import * as mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    topic: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    createdDate: Date
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;