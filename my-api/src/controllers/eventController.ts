import { Request, Response } from 'express';
import Event from '../models/events';

// Lấy tất cả sự kiện
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1, startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sự kiện' });
  }
};

// Lấy 1 sự kiện theo id
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy sự kiện' });
  }
};

// Thêm sự kiện mới
export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = new Event(req.body);
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi thêm sự kiện' });
  }
};

// Sửa sự kiện theo id
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updated = await Event.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Lỗi khi cập nhật sự kiện' });
  }
};

// Xóa sự kiện theo id
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await Event.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    res.json({ message: 'Đã xóa sự kiện', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa sự kiện' });
  }
};
