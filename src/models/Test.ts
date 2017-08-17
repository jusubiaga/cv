import * as mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    status: String,
    candidateId: String,
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    allowedTime: Number,
    remainingTime: Number,
    createdDate: Date,
    sentDate: Date,
    startedDate: Date,
    finishedDate: Date
});

const Test = mongoose.model('Test', testSchema);
export default Test;