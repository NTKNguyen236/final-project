import { Student, Teacher, CalendarEvent, Expense } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request thất bại');
  }
  return res.json();
}

// ===== STUDENTS =====
export const getStudents = (): Promise<Student[]> =>
  fetch(`${API_BASE_URL}/students`).then(handleResponse);

export const createStudent = (data: Student): Promise<Student> =>
  fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateStudent = (id: string, data: Student): Promise<Student> =>
  fetch(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteStudent = (id: string): Promise<void> =>
  fetch(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(handleResponse);

// ===== TEACHERS =====
export const getTeachers = (): Promise<Teacher[]> =>
  fetch(`${API_BASE_URL}/teachers`).then(handleResponse);

export const createTeacher = (data: Teacher): Promise<Teacher> =>
  fetch(`${API_BASE_URL}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateTeacher = (id: string, data: Teacher): Promise<Teacher> =>
  fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteTeacher = (id: string): Promise<void> =>
  fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(handleResponse);

// ===== EVENTS =====
export const getEvents = (): Promise<CalendarEvent[]> =>
  fetch(`${API_BASE_URL}/events`).then(handleResponse);

export const createEvent = (data: CalendarEvent): Promise<CalendarEvent> =>
  fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateEvent = (id: string, data: CalendarEvent): Promise<CalendarEvent> =>
  fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteEvent = (id: string): Promise<void> =>
  fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(handleResponse);

// ===== EXPENSES =====
export const getExpenses = (): Promise<Expense[]> =>
  fetch(`${API_BASE_URL}/expenses`).then(handleResponse);

export const createExpense = (data: Expense): Promise<Expense> =>
  fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateExpense = (id: string, data: Expense): Promise<Expense> =>
  fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteExpense = (id: string): Promise<void> =>
  fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(handleResponse);