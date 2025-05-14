# DSS Tools - Aplikasi Sistem Pendukung Keputusan

DSS Tools adalah aplikasi web yang menyediakan berbagai metode pengambilan keputusan multi-kriteria (Multi-Criteria Decision Making/MCDM) untuk membantu pengambilan keputusan yang lebih terstruktur dan objektif.

## Fitur Utama

- **Multiple Decision Making Methods**:
  - Simple Additive Weighting (SAW)
  - Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS)
  - Analytic Hierarchy Process (AHP)
  - Multi-Objective Optimization on the basis of Ratio Analysis (MOORA)
  - Simple Multi-Attribute Rating Technique (SMART)
  - Weighted Product (WP)

- **Manajemen Data**:
  - Input dan pengelolaan kriteria dengan bobot
  - Input dan pengelolaan alternatif dengan nilai
  - Dukungan untuk kriteria benefit dan cost
  - Penyimpanan data otomatis di browser

- **Visualisasi Hasil**:
  - Tabel hasil perhitungan
  - Grafik perbandingan hasil
  - Grafik bobot kriteria
  - Ekspor hasil ke PDF dan Excel

## Cara Penggunaan

1. **Input Data**:
   - Tambahkan kriteria dengan menentukan nama, bobot, dan tipe (benefit/cost)
   - Tambahkan alternatif dengan menentukan nama dan nilai untuk setiap kriteria

2. **Pilih Metode**:
   - Pilih metode pengambilan keputusan yang sesuai dengan kebutuhan
   - Setiap metode memiliki karakteristik dan keunggulan masing-masing

3. **Analisis Hasil**:
   - Lihat hasil perhitungan dalam bentuk tabel
   - Bandingkan hasil antar alternatif menggunakan grafik
   - Ekspor hasil untuk dokumentasi

## Metode yang Tersedia

### 1. Simple Additive Weighting (SAW)
Metode yang menghitung jumlah terbobot dari rating kinerja pada setiap alternatif pada semua kriteria.

### 2. TOPSIS
Metode yang menentukan alternatif terbaik berdasarkan kedekatan dengan solusi ideal positif dan jarak dengan solusi ideal negatif.

### 3. Analytic Hierarchy Process (AHP)
Metode yang menyusun keputusan kompleks ke dalam hierarki untuk analisis.

### 4. MOORA
Metode optimasi multi-tujuan berdasarkan analisis rasio.

### 5. SMART
Metode penilaian multi-atribut sederhana untuk peringkat alternatif.

### 6. Weighted Product (WP)
Metode yang menggunakan perkalian untuk menghubungkan rating atribut, di mana setiap rating atribut harus dipangkatkan terlebih dahulu dengan bobot atribut yang bersangkutan.

## Teknologi yang Digunakan

- React.js
- TypeScript
- Tailwind CSS
- Chart.js
- jspdf
- xlsx

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/yourusername/dss-tools.git
```

2. Install dependencies:
```bash
cd dss-tools
npm install
```

3. Jalankan aplikasi:
```bash
npm start
```

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk diskusi.

## Lisensi

MIT License 