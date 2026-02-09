import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:mokmok@localhost:5432/atk?schema=public'

function createPrismaClient() {
  try {
    const pool = new Pool({ 
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
    
    const adapter = new PrismaPg(pool)
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to create Prisma adapter:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
