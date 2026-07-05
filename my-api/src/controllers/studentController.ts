import { Request, Response } from 'express';
import Student from '../models/students';

// Lấy tất cả học sinh
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách học sinh' });
  }
};

// Lấy 1 học sinh theo id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy học sinh' });
  }
};

// Thêm học sinh mới
export const createStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = new Student(req.body);
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi thêm học sinh' });
  }
};

// Sửa thông tin học sinh theo id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi cập nhật học sinh' });
  }
};

// Xóa học sinh theo id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await Student.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    res.json({ message: 'Đã xóa học sinh', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa học sinh' });
  }
};
