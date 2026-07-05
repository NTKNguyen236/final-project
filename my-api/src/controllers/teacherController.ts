import { Request, Response } from 'express';
import Teacher from '../models/teachers';

// Lấy tất cả giáo viên
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().sort({ name: 1 });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giáo viên' });
  }
};

// Lấy 1 giáo viên theo id
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findOne({ id: req.params.id });
    if (!teacher) return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy giáo viên' });
  }
};

// Thêm giáo viên mới
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const newTeacher = new Teacher(req.body);
    const saved = await newTeacher.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi thêm giáo viên' });
  }
};

// Sửa thông tin giáo viên theo id
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await Teacher.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi cập nhật giáo viên' });
  }
};

// Xóa giáo viên theo id
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deleted = await Teacher.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    res.json({ message: 'Đã xóa giáo viên', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa giáo viên' });
  }
};
