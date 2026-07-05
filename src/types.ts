export interface Student {
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

export interface Teacher {
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

export interface CalendarEvent {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  color: 'purple' | 'orange' | 'yellow' | 'green' | 'red';
  teacherName?: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  status: 'Complete' | 'Pending' | 'Canceled';
  payer: string;
  purpose: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface NotificationActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  isToday: boolean;
  actionText?: string;
}
