import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button asChild>
            <Link href="/">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
