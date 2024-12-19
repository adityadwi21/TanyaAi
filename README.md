# Tanya AI (Powered by Gemini AI)

Aplikasi chatbot sederhana dan responsif yang memanfaatkan Gemini AI untuk menghasilkan respons terhadap pertanyaan pengguna dalam bahasa Indonesia. Aplikasi ini memungkinkan pengguna untuk berinteraksi dengan model AI, mengelola token, dan menangani peringatan konten tidak pantas. Dibangun dengan React dan terintegrasi dengan model Gemini Generative AI dari Google.

## Fitur

- **Antarmuka Chat:** Jendela chat yang mudah digunakan untuk berinteraksi dengan AI.
- **Manajemen Token:** Melacak token dan mengelola penggunaannya (token berkurang setiap interaksi).
- **Deteksi Konten Tidak Pantas:** Secara otomatis mendeteksi dan memberi peringatan kepada pengguna tentang bahasa yang tidak pantas.
- **Penyimpanan Lokal:** Menyimpan riwayat chat, jumlah token, dan peringatan secara lokal di browser.
- **Clear Chat:** Opsi untuk menghapus riwayat percakapan, jumlah token, dan peringatan.
- **Modal Peringatan Token Habis:** Memberitahu pengguna ketika token habis.
- **Ditenagai oleh Gemini AI:** Menggunakan model Gemini-1.5-Flash untuk menghasilkan respons.

## Instalasi

Untuk memulai proyek ini secara lokal:

### 1. Clone repositori
```bash
git clone https://github.com/adityadwi21/TanyaAi.git
cd TanyaAi
```

### 2. Instal dependensi
Pastikan Anda telah menginstal Node.js di mesin Anda. Kemudian, instal paket yang diperlukan:

```bash
npm install
```

### 3. Atur variabel lingkungan
Anda perlu mengatur kunci API Google untuk berinteraksi dengan model Gemini AI.

Buat file `.env` di root proyek dan tambahkan baris berikut:

```
GOOGLE_API_KEY=kunci-api-google-anda
```

### 4. Jalankan aplikasi
Mulai server pengembangan:

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:3000`.

## Cara Kerja

1. **Interaksi Pengguna:** Pengguna mengetikkan prompt dan mengirimkannya melalui antarmuka chat.
2. **API Backend:** Frontend mengirimkan permintaan POST ke endpoint `/api/generateResponse` dengan prompt dari pengguna.
3. **Gemini AI:** Server memanggil model Gemini AI menggunakan kunci API yang diberikan dan mengirimkan respons yang dihasilkan oleh AI.
4. **Penanganan Respons:** Respons ditampilkan di antarmuka chat, dan token dikurangi sesuai dengan interaksi.
5. **Sistem Peringatan:** Jika kata-kata tidak pantas terdeteksi dalam prompt, pesan peringatan akan ditampilkan.

## Dependensi

- `react` dan `react-dom` untuk membangun UI
- `marked` untuk merender teks markdown
- `@google/generative-ai` untuk menghubungkan ke Gemini AI
- `react-icons` untuk ikon (misalnya, ikon peringatan)
- `tailwind` untuk CSS
