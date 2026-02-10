# ATK App - Windows Service (WinSW)

Agar service bisa dipasang, WinSW memakai nama file `.exe` yang sama dengan `.xml`.

## Persiapan

1. **Build aplikasi sekali** (sebelum install service):
   ```batch
   pnpm build
   ```

2. **Salin WinSW agar nama cocok dengan config:**
   ```batch
   copy WinSW-x64.exe atk-service.exe
   ```

3. **Buat folder log** (opsional, WinSW bisa buat sendiri):
   ```batch
   mkdir logs
   ```

## Install & jalankan (CMD as Administrator)

```batch
cd C:\next\atk
atk-service.exe install
atk-service.exe start
```

## Cara penggunaan (sehari-hari)

### Jalankan / hentikan service

- **Start:**
  - CMD:
    - `atk-service.exe start`
  - PowerShell (kalau file ada di folder saat ini, wajib pakai `.\`):
    - `.\atk-service.exe start`

- **Stop:**
  - CMD: `atk-service.exe stop`
  - PowerShell: `.\atk-service.exe stop`

- **Status:**
  - CMD: `atk-service.exe status`
  - PowerShell: `.\atk-service.exe status`

### Kalau `start` tapi status tetap `Stopped`

Biasanya karena **path di `atk-service.xml` salah**, **Node/Next tidak ketemu**, atau **port 2000 sudah dipakai**.

Yang harus dicek:
- **Log error WinSW** di folder log (`logpath`), contoh:
  - `C:\next\atk\logs\*.log`
- Pastikan path di `atk-service.xml` sesuai lokasi project Anda (lihat bagian *Jika path project bukan...*).
- Pastikan aplikasi sudah pernah di-build:
  - `pnpm build`
- Pastikan port tidak bentrok (kalau perlu cek di Windows: `netstat -ano | findstr :2000`).

### Kalau Anda mengubah `atk-service.xml`

Service **harus reinstall** agar config baru terbaca:

```batch
atk-service.exe stop
atk-service.exe uninstall
atk-service.exe install
atk-service.exe start
```

## Set Automatic (jalan sebelum user login)

1. Buka **services.msc**
2. Cari **ATK App**
3. Klik kanan → Properties
4. **Startup type:** Automatic  
5. **Log On:** Local System account (default)  
6. OK

## Perintah lain

- Uninstall: `atk-service.exe uninstall`
- Status: `atk-service.exe status`
- Install: `atk-service.exe install`
- Start: `atk-service.exe start`
- Stop: `atk-service.exe stop`

## Setelah update / build baru

```batch
atk-service.exe stop
pnpm build
atk-service.exe start
```

## Jika path project bukan C:\next\atk

Edit `atk-service.xml`: ubah `workingdirectory`, `arguments` (path di dalam `"..."`), dan `logpath` sesuai lokasi project Anda.
