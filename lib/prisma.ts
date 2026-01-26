import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | null = null

// Lazy initialization
function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  if (!prismaInstance) {
    prismaInstance = new PrismaClient()
  }
  
  return prismaInstance
}

// Export as a proxy to delay initialization
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop]
  }
})
