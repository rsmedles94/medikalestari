# Fitur Tarif Kamar - Dokumentasi

## Deskripsi

Halaman baru yang menampilkan daftar semua kamar perawatan dalam format grid card. Halaman ini **otomatis terupdate** ketika kamar ditambahkan/diubah melalui admin panel.

## Struktur File

```
app/
  tarif-kamar/
    page.tsx          # Halaman utama yang menampilkan grid card kamar
  services/
    kamar-perawatan/
      page.tsx        # Halaman detail kamar individual
```

## Fitur Utama

### 1. **Halaman Tarif Kamar** (`/tarif-kamar`)

- Menampilkan semua kamar dalam grid layout (1 kolom mobile, 2 kolom tablet, 3 kolom desktop)
- Setiap card menampilkan:
  - Gambar kamar (gambar pertama dari room_images atau image_url)
  - Nama kamar
  - Harga per malam
  - Deskripsi singkat (line-clamp)
  - 3 fasilitas pertama + indikator fasilitas tambahan
  - Tombol "Lihat Detail" yang mengarah ke halaman detail

### 2. **Navigasi dari Navbar**

- Menu "Portal Pasien" → "Tarif Kamar" sekarang mengarah ke `/tarif-kamar`
- Routing sudah ditambahkan di `NavbarClient.tsx`

### 3. **Integrasi dengan Halaman Detail**

- Ketika klik "Lihat Detail" dari card, akan membuka halaman detail kamar dengan query parameter `?room={namaKamar}`
- Halaman detail akan otomatis menampilkan kamar yang dipilih
- Support navigasi manual dari URL

## Database Integration

### API yang Digunakan

- `fetchRoomTypes()` dari `@/lib/api`
- Mengambil data dari database Supabase (tabel `room_types` atau serupa)

### Data Flow

```
Admin Panel → Database (Supabase)
     ↓
fetchRoomTypes()
     ↓
Halaman Tarif Kamar (otomatis update)
     ↓
Halaman Detail Kamar (via query param)
```

## Auto-Update Mechanism

Halaman ini **otomatis terupdate** karena:

1. Menggunakan `fetchRoomTypes()` yang langsung query database
2. Tidak ada caching lokal yang statis
3. Data diload saat component mount
4. Ketika data di admin panel berubah → database berubah → halaman ini otomatis menampilkan data terbaru

## Styling & UX

- Skeleton loading saat data sedang diambil
- Shimmer animation untuk loading state
- Hover effects pada card dan gambar
- Responsive design untuk semua ukuran layar
- Motion animation untuk fade-in effect setiap card

## Cara Menggunakan

### Menambah Kamar Baru

1. Buka admin panel
2. Tambahkan kamar baru
3. Halaman `/tarif-kamar` akan otomatis menampilkan kamar baru

### Mengedit Kamar

1. Edit kamar di admin panel
2. Halaman akan otomatis menampilkan perubahan

### Menghapus Kamar

1. Hapus kamar di admin panel
2. Halaman akan otomatis menghapus card kamar tersebut

## URL Routes

- `/tarif-kamar` - Halaman daftar semua kamar
- `/services/kamar-perawatan` - Halaman detail kamar
- `/services/kamar-perawatan?room={namaKamar}` - Halaman detail kamar spesifik

## Component Dependencies

- `Next.js` - Framework
- `Framer Motion` - Animation
- `Lucide React` - Icons
- `Image` dari `next/image` - Optimized image
- `fetchRoomTypes` - API function

## Mobile Responsiveness

✅ Mobile (1 kolom)
✅ Tablet (2 kolom)
✅ Desktop (3 kolom)
✅ Full-width responsive padding
✅ Touch-friendly buttons

## Performance

- Loading skeleton untuk better UX
- Image optimization dengan Next.js Image component
- Efficient data fetching
- Memoized calculations

## Notes

- Halaman menggunakan client-side rendering ("use client")
- Data refreshes setiap kali component di-mount
- URL params di halaman detail untuk better sharability
