import { Request, Response } from 'express';
import Expense from '../models/expenses';

// Lấy tất cả chi tiêu
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiêu' });
  }
};

// Lấy 1 chi tiêu theo id
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOne({ id: req.params.id });
    if (!expense) return res.status(404).json({ message: 'Không tìm thấy chi tiêu' });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiêu' });
  }
};

// Thêm chi tiêu mới
export const createExpense = async (req: Request, res: Response) => {
  try {
    const newExpense = new Expense(req.body);
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi thêm chi tiêu' });
  }
};

// Sửa chi tiêu theo id
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy chi tiêu' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi cập nhật chi tiêu' });
  }
};

// Xóa chi tiêu theo id
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const deleted = await Expense.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy chi tiêu' });
    res.json({ message: 'Đã xóa chi tiêu', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa chi tiêu' });
  }
};
