import mongoose, { Document, Schema } from 'mongoose';

interface IntTaskModel extends Document {
    text: string;
}

const TaskSchema = new Schema<IntTaskModel>({
    text: { type: String, required: true },
});

const TaskModel = mongoose.model<IntTaskModel>('Task', TaskSchema);

export { TaskModel, IntTaskModel };