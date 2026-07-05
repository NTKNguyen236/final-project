import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photoUrl?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
  city: string;
  subject: string;
  about?: string;
}

const TeacherSchema = new Schema<ITeacher>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  photoUrl: { type: String },
  dateOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  university: { type: String, required: true },
  degree: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String, required: true },
  city: { type: String, required: true },
  subject: { type: String, required: true },
  about: { type: String },
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);