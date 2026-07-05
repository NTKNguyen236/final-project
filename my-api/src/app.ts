import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/db';

import eventRoutes from './routes/events';
import expenseRoutes from './routes/expenses';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API đang chạy ngon lành!' });
});

app.use('/api/events', eventRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Lỗi server' });
});