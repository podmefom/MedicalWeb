import Database from 'better-sqlite3';
import * as bcrypt from 'bcryptjs';

const db = new Database('dev.db');

// Хеширование пароля
const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const now = new Date().toISOString();

// Очищаем таблицы
db.exec('DELETE FROM AdminLog');
db.exec('DELETE FROM Appointment');
db.exec('DELETE FROM Doctor');
db.exec('DELETE FROM User');

// 1. Создаем пациентов
const insertUser = db.prepare(`
  INSERT INTO User (id, email, name, password, phone, role, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const patients = [
  { id: 'patient_1', email: 'ivan@example.com', name: 'Иван Петров', phone: '+79991234567', password: '123456' },
  { id: 'patient_2', email: 'maria@example.com', name: 'Мария Сидорова', phone: '+79989876543', password: '123456' },
];

patients.forEach(patient => {
  insertUser.run(
    patient.id,
    patient.email,
    patient.name,
    hashPassword(patient.password),
    patient.phone,
    'PATIENT',
    now,
    now
  );
});
console.log(`✅ Создано ${patients.length} пациентов`);

// 2. Создаем врачей (они тоже пользователи)
const doctors = [
  { id: 'doc_1', email: 'volkov@clinic.com', name: 'Д-р Александр Волков', phone: '+79991111111', password: 'doctor123', specialty: 'Кардиология', experience: 12, bio: 'Ведущий специалист по цифровой кардиологии и ИИ-диагностике.', image: '/doctors/volkov.jpg' },
  { id: 'doc_2', email: 'levitskaya@clinic.com', name: 'Д-р Мария Левицкая', phone: '+79992222222', password: 'doctor123', specialty: 'Неврология', experience: 8, bio: 'Эксперт по нейропластичности и восстановлению когнитивных функций.', image: '/doctors/levitskaya.jpg' },
  { id: 'doc_3', email: 'petrovsky@clinic.com', name: 'Д-р Сергей Петровский', phone: '+79993333333', password: 'doctor123', specialty: 'Онкология', experience: 15, bio: 'Специалист по молекулярной онкологии и персонализированному лечению.', image: '/doctors/petrovsky.jpg' },
  { id: 'doc_4', email: 'ivanova@clinic.com', name: 'Д-р Елена Иванова', phone: '+79994444444', password: 'doctor123', specialty: 'Гастроэнтерология', experience: 10, bio: 'Опыт в диагностике и лечении заболеваний ЖКТ, включая эндоскопию.', image: '/doctors/ivanova.jpg' },
];

const insertDoctor = db.prepare(`
  INSERT INTO Doctor (id, userId, specialty, experience, bio, image, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

doctors.forEach(doc => {
  insertUser.run(
    doc.id,
    doc.email,
    doc.name,
    hashPassword(doc.password),
    doc.phone,
    'DOCTOR',
    now,
    now
  );
  
  insertDoctor.run(
    doc.id,
    doc.id,
    doc.specialty,
    doc.experience,
    doc.bio,
    doc.image,
    now,
    now
  );
});
console.log(`✅ Создано ${doctors.length} врачей`);

// 3. Создаем админа
insertUser.run(
  'admin_1',
  'admin@clinic.com',
  'Администратор',
  hashPassword('admin123'),
  '+79995555555',
  'ADMIN',
  now,
  now
);
console.log('✅ Создан администратор');

// 4. Создаем тестовые записи
const insertAppointment = db.prepare(`
  INSERT INTO Appointment (id, patientId, patientPhone, patientEmail, date, doctorId, status, notes, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
dayAfter.setHours(14, 0, 0, 0);

const appointments = [
  {
    patientId: 'patient_1',
    patientPhone: '+79991234567',
    patientEmail: 'ivan@example.com',
    date: tomorrow.toISOString(),
    doctorId: 'doc_1',
    status: 'CONFIRMED',
    notes: 'Контрольный осмотр после рентгена сердца',
  },
  {
    patientId: 'patient_2',
    patientPhone: '+79989876543',
    patientEmail: 'maria@example.com',
    date: dayAfter.toISOString(),
    doctorId: 'doc_2',
    status: 'PENDING',
    notes: 'Первичная консультация',
  },
];

appointments.forEach((apt, idx) => {
  insertAppointment.run(
    `apt_${Date.now()}_${idx}`,
    apt.patientId,
    apt.patientPhone,
    apt.patientEmail,
    apt.date,
    apt.doctorId,
    apt.status,
    apt.notes,
    now,
    now
  );
});
console.log(`✅ Создано ${appointments.length} записей`);

console.log('\n✅ БАЗА_ДАННЫХ_ЗАПОЛНЕНА\n');
console.log('Тестовые учетные записи:');
console.log('- Пациент: ivan@example.com / 123456');
console.log('- Врач: volkov@clinic.com / doctor123');
console.log('- Админ: admin@clinic.com / admin123');

db.close();
