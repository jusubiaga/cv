import * as mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    description: String
});

const Task = mongoose.model('Task', taskSchema);
export default Task;