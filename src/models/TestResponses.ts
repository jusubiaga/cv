import * as mongoose from 'mongoose';

const testResponsesSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    responses: [
        {
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        response: String
        }],
    submitDate: Date
});

const TestResponses = mongoose.model('TestResponses', testResponsesSchema);
export default TestResponses;