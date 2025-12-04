import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin() {
  const users = await prisma.user.findMany()
  console.log('Current users:', users)

  if (users.length === 0) {
    console.log('No users found')
    return
  }

  const updated = await prisma.user.update({
    where: { id: users[0].id },
    data: { role: 'ADMIN' }
  })

  console.log('Updated user to ADMIN:', updated)
}

makeAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
