
import 'dotenv/config';
import mongoose from 'mongoose';
import Student from './models/students';
import Teacher from './models/teachers';
import Event from './models/events';
import Expense from './models/expenses';

const students = [
  { id: '#123456789', name: 'Samantha William', date: 'March 25, 2021', parentName: 'Mana William', city: 'New York', phone: '+12 345 6789 0', email: 'samantha@mail.com', grade: 'VII A', status: 'Complete', tuitionFee: 50036 },
  { id: '#123456790', name: 'Tony Soap', date: 'March 25, 2021', parentName: 'James Soap', city: 'Los Angeles', phone: '+12 345 6789 1', email: 'tony@mail.com', grade: 'VII B', status: 'Pending', tuitionFee: 50036 },
  { id: '#123456791', name: 'Karen Hope', date: 'March 25, 2021', parentName: 'Justin Hope', city: 'Chicago', phone: '+12 345 6789 2', email: 'karen@mail.com', grade: 'VII C', status: 'Complete', tuitionFee: 50036 },
  { id: '#123456792', name: 'Jordan Nico', date: 'March 25, 2021', parentName: 'Amanda Nico', city: 'Houston', phone: '+12 345 6789 3', email: 'jordan@mail.com', grade: 'VII A', status: 'Canceled', tuitionFee: 50036 },
  { id: '#123456793', name: 'Nadila Adja', date: 'March 25, 2021', parentName: 'Jack Adja', city: 'Phoenix', phone: '+12 345 6789 4', email: 'nadila@mail.com', grade: 'VII A', status: 'Complete', tuitionFee: 50036 },
  { id: '#123456794', name: 'Johnny Ahmad', date: 'March 25, 2021', parentName: 'Danny Ahmad', city: 'Philadelphia', phone: '+12 345 6789 5', email: 'johnny@mail.com', grade: 'VII A', status: 'Complete', tuitionFee: 50036 },
  { id: '#123456795', name: 'Bella Swan', date: 'March 28, 2021', parentName: 'Charlie Swan', city: 'San Antonio', phone: '+12 345 6789 6', email: 'bella@mail.com', grade: 'VII B', status: 'Complete', tuitionFee: 50036 },
  { id: '#123456796', name: 'Peter Parker', date: 'March 28, 2021', parentName: 'Richard Parker', city: 'San Diego', phone: '+12 345 6789 7', email: 'peter@mail.com', grade: 'VII C', status: 'Pending', tuitionFee: 50036 },
];

const teachers = [
  { id: 'T-001', name: 'Daniel Vance', subject: 'Mathematics', email: 'vance@mail.com', phone: '+1 (312) 555-0143', address: 'Chicago, Illinois, USA', dateOfBirth: '24 February 1985', placeOfBirth: 'Chicago, Illinois, USA', university: 'University of Chicago', degree: 'Master of Mathematics', startYear: '2015', endYear: '2019', city: 'Chicago', about: 'Experienced mathematics teacher specializing in advanced algebra, calculus, and discrete structures. Passionate about project-based learning and math puzzles.' },
  { id: 'T-002', name: 'Thomas House', subject: 'Science', email: 'house@mail.com', phone: '+1 (617) 555-0182', address: 'Boston, Massachusetts, USA', dateOfBirth: '14 August 1988', placeOfBirth: 'Boston, Massachusetts, USA', university: 'Massachusetts Institute of Technology', degree: 'Master of Physics', startYear: '2016', endYear: '2020', city: 'Boston', about: 'Dedicated physics educator focusing on experimental mechanics, thermodynamics, and hands-on laboratory learning modules for senior middle school students.' },
  { id: 'T-003', name: 'Diana Bennett', subject: 'Art', email: 'bennett@mail.com', phone: '+1 (415) 555-0129', address: 'San Francisco, California, USA', dateOfBirth: '10 November 1991', placeOfBirth: 'San Francisco, California, USA', university: 'Rhode Island School of Design', degree: 'Bachelor of Fine Arts', startYear: '2018', endYear: '2022', city: 'San Francisco', about: 'Fine arts professional with specialization in watercolor painting, contemporary sculpture, and digital illustration. Enjoys organizing student gallery events.' },
  { id: 'T-004', name: 'Sean Morris', subject: 'Biology', email: 'morris@mail.com', phone: '+1 (206) 555-0154', address: 'Seattle, Washington, USA', dateOfBirth: '05 May 1983', placeOfBirth: 'Seattle, Washington, USA', university: 'University of Washington', degree: 'PhD in Bio-Sciences', startYear: '2012', endYear: '2017', city: 'Seattle', about: 'Passionate biologist and researcher studying coastal ecosystem biodiversity. Guides students through engaging genetics, evolutionary models, and ecology studies.' },
  { id: 'T-005', name: 'Mary Harrison', subject: 'History', email: 'harrison@mail.com', phone: '+1 (215) 555-0167', address: 'Philadelphia, Pennsylvania, USA', dateOfBirth: '24 February 1997', placeOfBirth: 'Philadelphia, Pennsylvania, USA', university: 'University of Pennsylvania', degree: 'History Major', startYear: '2013', endYear: '2017', city: 'Philadelphia', about: 'Passionate historian specializing in American colonial history and 20th-century geopolitical transformations. Inspires critical thinking through historical analysis.' },
  { id: 'T-006', name: 'Jack Sullivan', subject: 'Physics', email: 'sullivan@mail.com', phone: '+1 (512) 555-0176', address: 'Austin, Texas, USA', dateOfBirth: '12 July 1989', placeOfBirth: 'Austin, Texas, USA', university: 'University of Texas at Austin', degree: 'Master of Physics Education', startYear: '2014', endYear: '2018', city: 'Austin', about: 'Committed to demystifying physical equations. Integrates robotics, automation systems, and electrical circuits into daily high school lesson structures.' },
  { id: 'T-007', name: 'Lucy Bradley', subject: 'Algorithm', email: 'lucy@mail.com', phone: '+1 (212) 555-0138', address: 'New York, New York, USA', dateOfBirth: '03 October 1990', placeOfBirth: 'New York, New York, USA', university: 'Columbia University', degree: 'Master of Computer Science', startYear: '2015', endYear: '2019', city: 'New York', about: 'Specialist in dynamic programming, data structures, and competitive coding formats. Drives computational thinking practices across the entire school.' },
  { id: 'T-008', name: 'Nellie Vance', subject: 'English', email: 'nellie@mail.com', phone: '+1 (404) 555-0111', address: 'Atlanta, Georgia, USA', dateOfBirth: '17 September 1992', placeOfBirth: 'Atlanta, Georgia, USA', university: 'Emory University', degree: 'Bachelor of English Literature', startYear: '2016', endYear: '2020', city: 'Atlanta', about: 'Enthusiastic educator in classical literature, public speaking, and creative poetry. Advocates for speech clubs, debate teams, and creative theater sessions.' },
  { id: 'T-009', name: 'Natalie Lawrence', subject: 'Programming', email: 'natalie@mail.com', phone: '+1 (650) 555-0102', address: 'Palo Alto, California, USA', dateOfBirth: '19 January 1994', placeOfBirth: 'San Jose, California, USA', university: 'Stanford University', degree: 'Bachelor of Software Engineering', startYear: '2017', endYear: '2021', city: 'Palo Alto', about: 'Full-stack software developer who pivoted into education. Instructs students in modern JavaScript, React architectures, mobile application logic, and systems.' },
  { id: 'T-010', name: 'Dakota Farrell', subject: 'Science', email: 'farrell@mail.com', phone: '+1 (303) 555-0195', address: 'Denver, Colorado, USA', dateOfBirth: '08 December 1986', placeOfBirth: 'Denver, Colorado, USA', university: 'University of Colorado Boulder', degree: 'Master of Chemical Sciences', startYear: '2014', endYear: '2018', city: 'Denver', about: 'Advocate for practical biochemistry and earth science. Implements clean environment experiments, renewable materials design, and green science modules.' },
  { id: 'T-011', name: 'Miranda Adams', subject: 'Art', email: 'miranda@mail.com', phone: '+1 (503) 555-0121', address: 'Portland, Oregon, USA', dateOfBirth: '15 March 1993', placeOfBirth: 'Portland, Oregon, USA', university: 'Pratt Institute', degree: 'Bachelor of Graphic Design', startYear: '2017', endYear: '2021', city: 'Portland', about: 'Expert in typography, modern vector layouts, art history, and photographic capture. Integrates traditional color theory with modern software media.' },
  { id: 'T-012', name: 'Ian Barker', subject: 'Biology', email: 'ian@mail.com', phone: '+1 (305) 555-0168', address: 'Miami, Florida, USA', dateOfBirth: '30 October 1987', placeOfBirth: 'Miami, Florida, USA', university: 'University of Miami', degree: 'PhD in Zoology', startYear: '2015', endYear: '2020', city: 'Miami', about: 'Focused on ecological studies, marine biology collections, and conservation tracking models. Organizes annual high school scientific field excursions.' },
];

const events = [
  { id: 'e1', title: 'Basic Algorithm', subject: 'Programming', date: '2026-07-06', startTime: '09.00', endTime: '10.00 AM', color: 'purple', teacherName: 'Lucy Bradley' },
  { id: 'e2', title: 'Basic Art', subject: 'Art', date: '2026-07-06', startTime: '10.30', endTime: '11.30 AM', color: 'orange', teacherName: 'Diana Bennett' },
  { id: 'e3', title: 'HTML & CSS Class', subject: 'Programming', date: '2026-07-08', startTime: '09.00', endTime: '10.00 AM', color: 'yellow', teacherName: 'Natalie Lawrence' },
  { id: 'e4', title: 'Simple Past Tense', subject: 'English', date: '2026-07-03', startTime: '09.00', endTime: '10.00 AM', color: 'green', teacherName: 'Nellie Vance' },
  { id: 'e5', title: 'Science Lab Session', subject: 'Science', date: '2026-07-08', startTime: '01.00', endTime: '02.30 PM', color: 'red', teacherName: 'Thomas House' },
  { id: 'e6', title: 'Math Quiz prep', subject: 'Mathematics', date: '2026-07-09', startTime: '11.00', endTime: '12.00 PM', color: 'purple', teacherName: 'Daniel Vance' },
  { id: 'e7', title: 'History Homework discussion', subject: 'History', date: '2026-07-15', startTime: '09.00', endTime: '10.00 AM', color: 'orange', teacherName: 'Mary Harrison' },
  { id: 'e8', title: 'Biology Lab Session', subject: 'Biology', date: '2026-07-17', startTime: '02.00', endTime: '03.30 PM', color: 'red', teacherName: 'Sean Morris' },
];

const expenses = [
  { id: '#123456789', date: '15 June 2026, 10:30 AM', amount: 25000, status: 'Complete', payer: 'John Doe', purpose: 'Teacher Salaries' },
  { id: '#123456790', date: '18 June 2026, 14:15 PM', amount: 1500, status: 'Pending', payer: 'Alice Smith', purpose: 'Electricity & Utilities' },
  { id: '#123456791', date: '22 June 2026, 09:45 AM', amount: 4800, status: 'Canceled', payer: 'Robert Johnson', purpose: 'School Building Maintenance' },
  { id: '#123456792', date: '29 June 2026, 11:20 AM', amount: 25000, status: 'Complete', payer: 'Emily Davis', purpose: 'Teacher Salaries' },
  { id: '#123456793', date: '01 July 2026, 16:00 PM', amount: 1500, status: 'Complete', payer: 'Michael Brown', purpose: 'Electricity & Utilities' },
  { id: '#123456794', date: '02 July 2026, 13:10 PM', amount: 3200, status: 'Complete', payer: 'Sarah Wilson', purpose: 'Library Books & Supplies' },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI as string;
    if (!uri) {
      throw new Error('Không tìm thấy MONGODB_URI trong file .env');
    }

    await mongoose.connect(uri);
    console.log('✅ Đã kết nối MongoDB');

    console.log('🗑️  Xóa dữ liệu cũ...');
    await Promise.all([
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Event.deleteMany({}),
      Expense.deleteMany({}),
    ]);

    console.log('🌱 Đang seed dữ liệu mẫu...');
    await Student.insertMany(students);
    console.log(`   → Đã thêm ${students.length} học sinh`);

    await Teacher.insertMany(teachers);
    console.log(`   → Đã thêm ${teachers.length} giáo viên`);

    await Event.insertMany(events);
    console.log(`   → Đã thêm ${events.length} sự kiện`);

    await Expense.insertMany(expenses);
    console.log(`   → Đã thêm ${expenses.length} khoản chi tiêu`);

    console.log('✅ Seed dữ liệu hoàn tất!');
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB');
    process.exit(0);
  }
}

seed();