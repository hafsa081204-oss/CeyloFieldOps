const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = (pw) => bcrypt.hashSync(pw, 10)

  await prisma.user.upsert({
    where: { email: 'admin@ceylo.lk' },
    update: {},
    create: { name: 'Admin User', email: 'admin@ceylo.lk', password: hash('admin123'), role: 'ADMIN' },
  })

  await prisma.user.upsert({
    where: { email: 'hr@ceylo.lk' },
    update: {},
    create: { name: 'HR Manager', email: 'hr@ceylo.lk', password: hash('hr123456'), role: 'HR_MANAGER' },
  })

  await prisma.user.upsert({
    where: { email: 'client@ceylo.lk' },
    update: {},
    create: { name: 'Dialog Axiata', email: 'client@ceylo.lk', password: hash('client123'), role: 'CLIENT' },
  })

  const workerUser = await prisma.user.upsert({
    where: { email: 'worker@ceylo.lk' },
    update: {},
    create: { name: 'Kasun Perera', email: 'worker@ceylo.lk', password: hash('worker123'), role: 'FIELD_WORKER' },
  })

  await prisma.worker.upsert({
    where: { userId: workerUser.id },
    update: {},
    create: {
      userId: workerUser.id,
      skills: ['Electrical', 'Plumbing', 'Networking'],
      location: 'Kandy',
      latitude: 7.2906,
      longitude: 80.6337,
      isAvailable: true,
      rating: 4.5,
    },
  })

  console.log('Seed done! Login with:')
  console.log('admin@ceylo.lk / admin123')
  console.log('hr@ceylo.lk / hr123456')
  console.log('client@ceylo.lk / client123')
  console.log('worker@ceylo.lk / worker123')
}

main().catch(console.error).finally(() => prisma.$disconnect())