import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  id: string;
  date: string;
  amount: number;
  status: 'Complete' | 'Pending' | 'Canceled';
  payer: string;
  purpose: string;
}

const ExpenseSchema = new Schema<IExpense>({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Complete', 'Pending', 'Canceled'], required: true },
  payer: { type: String, required: true },
  purpose: { type: String, required: true },
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);