import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id: string;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  color: 'purple' | 'orange' | 'yellow' | 'green' | 'red';
  teacherName?: string;
}

const EventSchema = new Schema<IEvent>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  color: { type: String, enum: ['purple', 'orange', 'yellow', 'green', 'red'], required: true },
  teacherName: { type: String },
});

export default mongoose.model<IEvent>('Event', EventSchema);