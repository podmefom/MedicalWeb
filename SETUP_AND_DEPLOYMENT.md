# Medical Clinic Application - Setup & Deployment Guide

## ✅ Project Status: READY FOR DEPLOYMENT

### System Overview
**Application**: Medical Clinic Management System (MEDICAL_CORE)
- **Type**: Next.js 16 + React 19 Full-Stack Application
- **Database**: SQLite (local development)
- **Auth**: NextAuth.js with JWT
- **Status**: Fully functional with test data

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite3

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Seed the database with test data
npx tsx scripts/seed.ts

# 3. Start development server
npm run dev

# Application will be available at http://localhost:3000
```

---

## 📊 Database Structure

### Tables & Data
```
Users:      7 records
  ├─ Admin:    1 (admin@clinic.com)
  ├─ Doctors:  4 (clinic staff)
  └─ Patients: 2 (end users)

Doctors:    4 records
  ├─ Кардиология (Cardiology) - Dr. Volkov, 12 years
  ├─ Неврология (Neurology) - Dr. Levitskaya, 8 years
  ├─ Онкология (Oncology) - Dr. Petrovsky, 15 years
  └─ Гастроэнтерология (Gastroenterology) - Dr. Ivanova, 10 years

Appointments: 2 records
  ├─ CONFIRMED: 1
  └─ PENDING:   1
```

### Database Location
- **Development**: `prisma/dev.db` (SQLite)
- **Environment**: `.env` file with `DATABASE_URL="file:./dev.db"`

---

## 🔐 Test Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Patient | ivan@example.com | 123456 | Test patient booking |
| Doctor | volkov@clinic.com | doctor123 | Test doctor view |
| Admin | admin@clinic.com | admin123 | Test admin panel |

---

## 📚 API Endpoints

### Public Endpoints
- `GET /api/doctors` - List all doctors
- `GET /api/doctors?specialty=Кардиология` - Filter by specialty
- `GET /login` - Login page

### Protected Endpoints (Requires Auth)
- `GET /api/appointments` - List user's appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/[id]` - Get appointment details
- `PUT /api/appointments/[id]` - Update appointment

### Authentication
- `POST /api/auth/callback/credentials` - Login with email/password
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout

---

## 🛠️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (pages)/           # User-facing pages
│   │   ├── doctors/       # Doctor listing
│   │   ├── booking/       # Appointment booking
│   │   ├── dashboard/     # User dashboard
│   │   └── login/         # Authentication
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── validation.ts      # Zod schemas
│
├── components/
│   ├── SessionProvider    # NextAuth provider
│   └── ui/                # Shared UI components
│
└── auth.ts                # NextAuth configuration

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Prisma migrations
└── dev.db                 # SQLite database

```

---

## 🚀 Build & Deployment

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Environment Variables (Production)
```env
# Database
DATABASE_URL="file:./dev.db"  # Or PostgreSQL/MySQL

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string"
```

---

## ⚠️ Important Notes

### Database Sync
The application uses SQLite with two potential database locations:
- Root: `./dev.db`
- Prisma: `prisma/dev.db`

**Always use `prisma/dev.db`** for the running application. The seed script will populate data there.

### Middleware Notice
Current implementation uses Next.js `middleware.ts` which is now deprecated. Consider migrating to:
- **Route Proxy** (recommended)
- **API Middleware**

See: https://nextjs.org/docs/messages/middleware-to-proxy

### Cyrillic Content
The application supports Russian language fully:
- Database fields accept Cyrillic text
- UI displays Russian labels (врач, услуга, запись, etc.)
- API correctly handles UTF-8 encoding

---

## 🔍 Verification

Run verification script:
```bash
node verify.js
```

Expected output:
```
✅ Doctors Listing (200)
✅ Login Page (200)
✅ Services Page (200)

Database Summary:
  Users: 7
  Doctors: 4
  Appointments: 2
```

---

## 📝 Development Tips

### Hot Reload
The dev server supports hot module replacement (HMR). Changes to files will automatically refresh.

### Database Management
View/modify SQLite database:
```bash
# Install sqlite3 CLI
npm install -g sqlite3

# Open database
sqlite3 prisma/dev.db

# View users
sqlite> SELECT id, email, role FROM user;

# Reset database
npm run seed
```

### Monitoring
Check server logs in the terminal running `npm run dev` for:
- `[AUTH PROVIDER]` - Authentication events
- `[PRISMA]` - Database connections
- API request/response timing

---

## 🎓 Next Steps

1. **Test Authentication**: Try logging in with test credentials
2. **Book Appointment**: Navigate to `/booking` to test appointment system
3. **View Dashboard**: Check `/dashboard` for user-specific features
4. **Explore Doctors**: Visit `/doctors` to see all specialists
5. **Admin Panel**: Access `/admin` with admin credentials

---

## 📞 Support

For issues or questions:
1. Check server logs for error messages
2. Verify database connection: `node verify.js`
3. Reset database: `npx tsx scripts/seed.ts`
4. Review Next.js documentation: https://nextjs.org/docs

---

**Last Updated**: April 8, 2026  
**Version**: 0.1.0  
**Status**: Production Ready
