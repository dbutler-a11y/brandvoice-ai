import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Get Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  // Get all Supabase auth users
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error fetching Supabase users:', error)
    return
  }

  console.log('Supabase Auth users:', users?.map(u => ({ id: u.id, email: u.email })))

  if (!users || users.length === 0) {
    console.log('No Supabase auth users found')
    return
  }

  // Create User record for each Supabase user (if not exists)
  for (const authUser of users) {
    const existing = await prisma.user.findUnique({
      where: { id: authUser.id }
    })

    if (existing) {
      console.log(`User ${authUser.email} already exists, updating to ADMIN`)
      await prisma.user.update({
        where: { id: authUser.id },
        data: { role: 'ADMIN' }
      })
    } else {
      console.log(`Creating ADMIN user for ${authUser.email}`)
      await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          role: 'ADMIN'
        }
      })
    }
  }

  console.log('Done! All users set to ADMIN')
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
