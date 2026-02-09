export interface User {
  idUser: number
  username: string
  level: "user" | "admin"
  jabatan: string
}

export interface UserFormData {
  username: string
  password: string
  level: "" | "user" | "admin"
  jabatan: string
}
