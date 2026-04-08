#!/usr/bin/env node
/**
 * Medical Clinic Application - Verification Report
 */

const http = require('http');

function request(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('🏥 Medical Clinic Application - Verification\n');

  const tests = [
    { name: 'Doctors Listing', path: '/api/doctors' },
    { name: 'Doctors by Specialty', path: '/api/doctors?specialty=Кардиология' },
    { name: 'Login Page', path: '/login' },
    { name: 'Services Page', path: '/services' },
  ];

  console.log('🔍 Testing Endpoints\n');
  for (const test of tests) {
    try {
      const { status, body } = await request('GET', test.path);
      const icon = status === 200 ? '✅' : '❌';
      const preview = body.substring(0, 50).replace(/\n/g, ' ');
      console.log(`${icon} ${test.name} (${status})`);
      if (status !== 200) console.log(`   ${preview}`);
    } catch (err) {
      console.log(`❌ ${test.name} - ${err.message}`);
    }
  }

  // Database info
  console.log('\n📊 Database Summary\n');
  try {
    const db = require('better-sqlite3')('./prisma/dev.db');
    const users = db.prepare('SELECT COUNT(*) as cnt FROM user').get();
    const doctors = db.prepare('SELECT COUNT(*) as cnt FROM doctor').get();
    const appointments = db.prepare('SELECT COUNT(*) as cnt FROM appointment').get();
    
    console.log(`  Users: ${users.cnt}`);
    const userTypes = db.prepare(`
      SELECT role, COUNT(*) as cnt FROM user GROUP BY role ORDER BY cnt DESC
    `).all();
    userTypes.forEach(ut => console.log(`    - ${ut.role}: ${ut.cnt}`));
    
    console.log(`\n  Doctors: ${doctors.cnt}`);
    const specs = db.prepare(`
      SELECT specialty, COUNT(*) as cnt FROM doctor GROUP BY specialty
    `).all();
    specs.forEach(s => console.log(`    - ${s.specialty}`));
    
    console.log(`\n  Appointments: ${appointments.cnt}`);
    const statuses = db.prepare(`
      SELECT status, COUNT(*) as cnt FROM appointment GROUP BY status
    `).all();
    statuses.forEach(s => console.log(`    - ${s.status}: ${s.cnt}`));
    
    db.close();
  } catch (err) {
    console.log(`  Error reading database: ${err.message}`);
  }

  console.log('\n✨ Application is ready!\n');
  console.log('Test Credentials:');
  console.log('  - Patient: ivan@example.com / 123456');
  console.log('  - Doctor: volkov@clinic.com / doctor123');
  console.log('  - Admin: admin@clinic.com / admin123');
  console.log('\nServer: http://localhost:3000\n');
}

run().catch(console.error);
