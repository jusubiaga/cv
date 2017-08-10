import * as mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    status: String,
    candidateId: String,
    examId: String,
    createdDate: Date
});

const Test = mongoose.model('Test', testSchema);
export default Test;