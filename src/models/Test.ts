import * as mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    status: String,
    candidateId: String,
    examId: String,
    allowedTime: Number,
    remainingTime: Number,
    createdDate: Date,
    sentDate: Date,
    startDate: Date,
    finishDate: Date
});

const Test = mongoose.model('Test', testSchema);
export default Test;