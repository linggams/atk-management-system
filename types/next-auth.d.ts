import { UserLevel } from "./index"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      level: UserLevel
      jabatan: string
    }
  }

  interface User {
    username: string
    level: UserLevel
    jabatan: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
    level: UserLevel
    jabatan: string
  }
}
