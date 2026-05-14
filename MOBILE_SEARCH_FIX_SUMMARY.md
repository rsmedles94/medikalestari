# PERBAIKAN: Mobile Search Modal - Bottom Navbar Hide

## Ringkasan Perubahan

### 1. **SearchModalContext.tsx** (Baru)

- Context global untuk manage search modal state
- Menggunakan `useMemo` untuk optimasi performa
- Menyediakan methods: `openSearch()`, `closeSearch()`, `toggleSearch()`

### 2. **MobileBottomNavbar.tsx**

**Sebelum:**

```tsx
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#014f86] z-50 ...">
  {/* Selalu render */}
</nav>
```

**Sesudah:**

```tsx
{
  !isSearchOpen && (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#014f86] z-50 ...">
      {/* Conditional render - hide tanpa animasi */}
    </nav>
  );
}
```

**Perubahan:**

- Conditional rendering berdasarkan `isSearchOpen`
- Hapus AnimatePresence dan motion.nav (tidak ada animasi)
- Bottom navbar hide/show instant (tidak smooth)

### 3. **MobileSearchModal.tsx**

**Perubahan:**

- Tambah `handleClose()` function
- Gunakan `closeSearch()` dari context di handleClose
- Update onClick handler untuk menutup navbar saat navigasi

### 4. **NavbarClient.tsx**

**Sebelum:**

```tsx
const [isSearchOpen, setIsSearchOpen] = useState(false);
// ... menggunakan state lokal
onClick={() => setIsMobileSearchOpen(true)}
```

**Sesudah:**

```tsx
const { isSearchOpen, openSearch, closeSearch } = useSearchModal();
// ... menggunakan context
onClick={() => openSearch()}
```

**Perubahan:**

- Hapus state lokal `isMobileSearchOpen`
- Import `useSearchModal` hook
- Gunakan context state untuk control search modal
- Update onClick handler search button ke `openSearch()`
- Update SearchDropdown onClose ke `closeSearch()`

### 5. **layout.tsx**

**Perubahan:**

- Import `SearchModalProvider`
- Wrap `LayoutContent` dengan `SearchModalProvider`
- Memastikan context tersedia untuk seluruh aplikasi

## Alur Kerja

```
User Klik Search Button (Mobile)
         ↓
NavbarClient: onClick={() => openSearch()}
         ↓
SearchModalContext: setIsSearchOpen(true)
         ↓
MobileBottomNavbar: !isSearchOpen = false
         ↓
Bottom Navbar: Hidden (Instant)
         ↓
MobileSearchModal: Display
         ↓
---
User Klik Batal / Navigasi
         ↓
MobileSearchModal: handleClose()
         ↓
SearchModalContext: setIsSearchOpen(false)
         ↓
MobileBottomNavbar: !isSearchOpen = true
         ↓
Bottom Navbar: Visible (Instant)
```

## Key Features

✅ **Hide Tanpa Animasi** - Bottom navbar hide/show instant  
✅ **Global State** - Context management untuk seluruh app  
✅ **Performance** - useMemo & useCallback optimization  
✅ **Clean Code** - Hapus duplicate state  
✅ **Conditional Render** - Navbar tidak di-render ke DOM saat hidden

## Testing Checklist

- [ ] Klik search button di mobile
- [ ] Bottom navbar hilang (instant)
- [ ] Search modal muncul
- [ ] Klik batal/navigasi
- [ ] Bottom navbar muncul kembali (instant)
- [ ] Test di berbagai ukuran mobile screen

---

**Status**: ✅ Ready for Testing  
**Tanggal**: May 14, 2026
