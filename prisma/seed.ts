import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.doctor.deleteMany() // Очистка перед заполнением
  
  await prisma.doctor.createMany({
    data: [
      { name: 'Д-р А. Воскресенский', specialty: 'КАРДИОЛОГИЯ', experience: 12, bio: 'Специалист по аритмии', image: '/docs/1.jpg' },
      { name: 'Д-р Е. Нейронова', specialty: 'НЕВРОЛОГИЯ', experience: 8, bio: 'Лечение мигреней', image: '/docs/2.jpg' },
      { name: 'Д-р И. Белозубов', specialty: 'СТОМАТОЛОГИЯ', experience: 15, bio: 'Эстетическая реставрация', image: '/docs/3.jpg' },
    ],
  })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })