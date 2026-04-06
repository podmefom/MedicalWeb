import Database from 'better-sqlite3';

const db = new Database('dev.db');

// Очищаем таблицы
db.exec('DELETE FROM Appointment');
db.exec('DELETE FROM Doctor');

// Вставляем врачей
const insertDoctor = db.prepare(`
  INSERT INTO Doctor (id, name, specialty, experience, bio, image, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const doctors = [
  {
    id: '1',
    name: 'Д-р Александр Волков',
    specialty: 'Кардиология',
    experience: 12,
    bio: 'Ведущий специалист по цифровой кардиологии и ИИ-диагностике.',
    image: '/doctors/volkov.jpg',
  },
  {
    id: '2',
    name: 'Д-р Мария Левицкая',
    specialty: 'Неврология',
    experience: 8,
    bio: 'Эксперт по нейропластичности и восстановлению когнитивных функций.',
    image: '/doctors/levitskaya.jpg',
  },
  {
    id: '3',
    name: 'Д-р Сергей Петровский',
    specialty: 'Онкология',
    experience: 15,
    bio: 'Специалист по молекулярной онкологии и персонализированному лечению.',
    image: '/doctors/petrovsky.jpg',
  },
  {
    id: '4',
    name: 'Д-р Елена Иванова',
    specialty: 'Гастроэнтерология',
    experience: 10,
    bio: 'Опыт в диагностике и лечении заболеваний ЖКТ, включая эндоскопию.',
    image: '/doctors/ivanova.jpg',
  },
];

const now = new Date().toISOString();

doctors.forEach(doc => {
  try {
    insertDoctor.run(
      doc.id,
      doc.name,
      doc.specialty,
      doc.experience,
      doc.bio,
      doc.image,
      now,
      now
    );
  } catch (e: any) {
    console.error(`Ошибка при вставке врача ${doc.name}:`, e.message);
  }
});

console.log(`✅ Добавлено ${doctors.length} врачей`);

// Вставляем записи
const insertAppointment = db.prepare(`
  INSERT INTO Appointment (id, patientName, patientPhone, patientEmail, date, doctorId, status, notes, createdAt, updatedAt)
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
    patientName: 'Иван Петров',
    patientPhone: '9991234567',
    patientEmail: 'ivan@example.com',
    date: tomorrow.toISOString(),
    doctorId: '1',
    status: 'CONFIRMED',
    notes: 'Контрольный осмотр после рентгена сердца',
  },
  {
    patientName: 'Мария Сидорова',
    patientPhone: '9989876543',
    patientEmail: null,
    date: dayAfter.toISOString(),
    doctorId: '2',
    status: 'PENDING',
    notes: 'Первичная консультация',
  },
];

appointments.forEach((apt, idx) => {
  try {
    const id = `apt_${Date.now()}_${idx}`;
    insertAppointment.run(
      id,
      apt.patientName,
      apt.patientPhone,
      apt.patientEmail,
      apt.date,
      apt.doctorId,
      apt.status,
      apt.notes,
      now,
      now
    );
  } catch (e: any) {
    console.error(`Ошибка при вставке записи:`, e.message);
  }
});

console.log(`✅ Добавлено ${appointments.length} записей`);
console.log('✅ БАЗА_ДАННЫХ_ЗАПОЛНЕНА');

db.close();
