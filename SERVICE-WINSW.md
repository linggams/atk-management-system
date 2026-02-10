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

## Set Automatic (jalan sebelum user login)

1. Buka **services.msc**
2. Cari **ATK App**
3. Klik kanan → Properties
4. **Startup type:** Automatic  
5. **Log On:** Local System account (default)  
6. OK

## Perintah lain

- Stop: `atk-service.exe stop`
- Uninstall: `atk-service.exe uninstall`
- Status: `atk-service.exe status`

## Setelah update / build baru

```batch
atk-service.exe stop
pnpm build
atk-service.exe start
```

## Jika path project bukan C:\next\atk

Edit `atk-service.xml`: ubah `workingdirectory`, `arguments` (path di dalam `"..."`), dan `logpath` sesuai lokasi project Anda.
