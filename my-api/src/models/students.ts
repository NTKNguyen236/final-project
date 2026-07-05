import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  id: string;
  name: string;
  date: string;
  parentName: string;
  city: string;
  phone: string;
  email: string;
  grade: string;
  photoUrl?: string;
  status: 'Complete' | 'Pending' | 'Canceled';
  tuitionFee: number;
  paymentHistory?: string[];
}

const StudentSchema = new Schema<IStudent>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  parentName: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  grade: { type: String, required: true },
  photoUrl: { type: String },
  status: { type: String, enum: ['Complete', 'Pending', 'Canceled'], required: true },
  tuitionFee: { type: Number, required: true },
  paymentHistory: { type: [String] },
});

export default mongoose.model<IStudent>('Student', StudentSchema);