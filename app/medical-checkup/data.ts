// MCU Packages Data - Hardcoded
export interface MCUPackageDetail {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  price: string;
  fullDescription: string;
  benefits: string[];
  examinations?: string[];
}

export const MCU_DATA: MCUPackageDetail[] = [
  {
    id: "paket-rose",
    title: "Paket Rose",
    shortDescription: "Paket pemeriksaan kesehatan menyeluruh dan komprehensif",
    image: "/images/mcu/rose.webp",
    price: "Rp. 1.089.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Paket Rose</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket pemeriksaan kesehatan yang sangat komprehensif dari Rumah Sakit Medika Lestari. 
        Dirancang untuk mendeteksi secara dini berbagai parameter kesehatan vital termasuk profil lipid lengkap (HDL, LDL, Trigliserida), fungsi organ, hingga skrining Hepatitis B (HBsAg).
      </p>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Paket:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Pemeriksaan kesehatan preventif menyeluruh</li>
        <li>Evaluasi fungsi jantung, paru-paru, hati, dan ginjal</li>
        <li>Skrining risiko penyakit kardiovaskular dan diabetes</li>
        <li>Deteksi dini infeksi Hepatitis B</li>
      </ul>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Pemeriksaan yang Termasuk:</h3>
      <p class="text-gray-700 mb-4">Paket Rose mencakup 15 parameter pemeriksaan klinis dan penunjang medis yang lengkap.</p>
    `,
    benefits: [
      "Pemeriksaan kesehatan preventif menyeluruh",
      "Evaluasi fungsi jantung, paru-paru, hati, dan ginjal",
      "Skrining risiko penyakit kardiovaskular dan diabetes",
      "Deteksi dini infeksi Hepatitis B",
    ],
    examinations: [
      "Pemeriksaan Dokter Umum",
      "Darah Lengkap",
      "Urine Lengkap",
      "Gula Darah Puasa",
      "Cholesterol",
      "Trigliserida",
      "HDL Cholesterol",
      "LDL Cholesterol",
      "Uric Acid / Asam Urat",
      "HBSAG",
      "THORAX RONTGEN",
      "Ureum Kreatinin",
      "Elektrokardiogram (EKG)",
      "SGPT",
      "SGOT",
    ],
  },
  {
    id: "paket-orchid",
    title: "Paket Orchid",
    shortDescription:
      "Paket pemeriksaan kesehatan lengkap untuk mendukung gaya hidup aktif",
    image: "/images/mcu/orchid.webp",
    price: "Rp. 799.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Paket Orchid</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket Orchid memberikan pemeriksaan kesehatan berkala yang ideal untuk memantau fungsi metabolik tubuh. 
        Mencakup pemeriksaan fisik oleh dokter, rontgen thorax, rekam jantung (EKG), hingga fungsi hati dan ginjal.
      </p>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Paket:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Evaluasi klinis organ utama (Paru-paru dan Jantung)</li>
        <li>Monitoring kadar gula darah dan asam urat tubuh</li>
        <li>Skrining fungsi filtrasi ginjal dan enzim hati</li>
        <li>Penilaian profil kolesterol dasar</li>
      </ul>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Pemeriksaan yang Termasuk:</h3>
      <p class="text-gray-700 mb-4">Paket Orchid mencakup 11 parameter pemeriksaan medis esensial.</p>
    `,
    benefits: [
      "Evaluasi klinis organ utama (Paru-paru dan Jantung)",
      "Monitoring kadar gula darah dan asam urat tubuh",
      "Skrining fungsi filtrasi ginjal dan enzim hati",
      "Penilaian profil kolesterol dasar",
    ],
    examinations: [
      "Pemeriksaan Dokter Umum",
      "Darah Lengkap",
      "Gula Darah Puasa",
      "Cholesterol",
      "Trigliserida",
      "Uric Acid / Asam Urat",
      "Ureum Kreatinin",
      "THORAX RONTGEN",
      "Elektrokardiogram (EKG)",
      "SGOT",
      "SGPT",
    ],
  },
  {
    id: "paket-jasmine",
    title: "Paket Jasmine",
    shortDescription:
      "Paket pemeriksaan kesehatan dasar esensial untuk screening awal",
    image: "/images/mcu/jasmine.webp",
    price: "Rp. 619.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Paket Jasmine</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket Jasmine dirancang sebagai langkah awal screening kesehatan yang praktis dan efisien. 
        Sangat cocok untuk pemeriksaan kesehatan rutin tahunan guna memantau kondisi fisik umum, profil lemak darah, serta kondisi jantung dan paru.
      </p>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Paket:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Screening awal penyakit degeneratif (Diabetes & Kolesterol)</li>
        <li>Pemeriksaan radiologi paru standar</li>
        <li>Deteksi dini gangguan irama jantung melalui EKG</li>
        <li>Evaluasi kondisi hemoglobin dan sel darah standar</li>
      </ul>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Pemeriksaan yang Termasuk:</h3>
      <p class="text-gray-700 mb-4">Paket Jasmine mencakup 8 parameter pemeriksaan kesehatan utama.</p>
    `,
    benefits: [
      "Screening awal penyakit degeneratif (Diabetes & Kolesterol)",
      "Pemeriksaan radiologi paru standar",
      "Deteksi dini gangguan irama jantung melalui EKG",
      "Evaluasi kondisi hemoglobin dan sel darah standar",
    ],
    examinations: [
      "Pemeriksaan Dokter Umum",
      "Darah Lengkap",
      "Gula Darah Puasa",
      "Cholesterol",
      "Trigliserida",
      "Uric Acid / Asam Urat",
      "THORAX RONTGEN",
      "Elektrokardiogram (EKG)",
    ],
  },
  {
    id: "paket-lotus",
    title: "Paket Lotus",
    shortDescription:
      "Paket pemeriksaan kesehatan fokus pada fungsi pernapasan, jantung, dan hepatitis",
    image: "/images/mcu/lotus.webp",
    price: "Rp. 697.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Paket Lotus</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket Lotus menawarkan kombinasi unik pemeriksaan kesehatan yang menitikberatkan pada skrining Hepatitis B (HBsAg), status urin dan darah lengkap, serta pemeriksaan penunjang jantung (EKG) dan paru-paru (Thorax Rontgen).
      </p>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Paket:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Skrining spesifik infeksi virus Hepatitis B</li>
        <li>Evaluasi kesehatan saluran kemih melalui urine lengkap</li>
        <li>Pemeriksaan radiologi dada untuk memantau paru dan jantung</li>
        <li>Pemeriksaan fisik langsung oleh dokter umum</li>
      </ul>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Pemeriksaan yang Termasuk:</h3>
      <p class="text-gray-700 mb-4">Paket Lotus mencakup 6 parameter pemeriksaan klinis penting.</p>
    `,
    benefits: [
      "Skrining spesifik infeksi virus Hepatitis B",
      "Evaluasi kesehatan saluran kemih melalui urine lengkap",
      "Pemeriksaan radiologi dada untuk memantau paru dan jantung",
      "Pemeriksaan fisik langsung oleh dokter umum",
    ],
    examinations: [
      "Pemeriksaan Dokter Umum",
      "Darah Lengkap",
      "HBSAG",
      "Urine Lengkap",
      "THORAX RONTGEN",
      "Elektrokardiogram (EKG)",
    ],
  },
  {
    id: "paket-clover",
    title: "Paket Clover",
    shortDescription:
      "Paket pemeriksaan komprehensif lengkap dengan evaluasi ginjal dan hati",
    image: "/images/mcu/clover.webp",
    price: "Rp. 857.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Paket Clover</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket Clover menghadirkan pemeriksaan kesehatan menyeluruh dengan cakupan parameter laboratorium yang luas. 
        Dilengkapi dengan analisis fungsi ginjal (Ureum, Kreatinin) serta fungsi hati (SGOT, SGPT) untuk mendeteksi potensi gangguan organ dalam sedini mungkin.
      </p>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Paket:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Pemeriksaan panel fungsi ginjal komprehensif</li>
        <li>Pemeriksaan panel enzim hati (SGOT & SGPT)</li>
        <li>Analisis lengkap metabolisme gula darah dan asam urat</li>
        <li>Evaluasi jantung (EKG) dan rontgen dada (Thorax)</li>
      </ul>
      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Pemeriksaan yang Termasuk:</h3>
      <p class="text-gray-700 mb-4">Paket Clover mencakup 12 parameter pemeriksaan kesehatan terintegrasi.</p>
    `,
    benefits: [
      "Pemeriksaan panel fungsi ginjal komprehensif",
      "Pemeriksaan panel enzim hati (SGOT & SGPT)",
      "Analisis lengkap metabolisme gula darah dan asam urat",
      "Evaluasi jantung (EKG) dan rontgen dada (Thorax)",
    ],
    examinations: [
      "Pemeriksaan Dokter Umum",
      "Darah Lengkap",
      "Urine Lengkap",
      "Gula Darah Puasa",
      "Cholesterol",
      "Trigliserida",
      "Uric Acid / Asam Urat",
      "THORAX RONTGEN",
      "Ureum Kreatinin",
      "Elektrokardiogram (EKG)",
      "SGPT",
      "SGOT",
    ],
  },
  {
    id: "tes-bebas-narkoba",
    title: "Tes Bebas Narkoba",
    shortDescription:
      "Layanan uji penapisan zat narkotika dan psikotropika (3 & 6 Parameter)",
    image: "/images/mcu/narkotika.webp",
    price: "Rp. 125.000 - Rp. 165.000",
    fullDescription: `
      <h2 class="text-3xl font-bold text-black mb-4">Tes Bebas Narkoba</h2>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Rumah Sakit Medika Lestari menyediakan layanan Tes Bebas Narkoba resmi yang akurat, cepat, dan terpercaya. 
        Layanan ini tersedia dalam dua jenis pilihan paket parameter sesuai dengan kebutuhan administrasi pekerjaan, pendidikan, maupun instansi resmi.
      </p>
      
      <h3 class="text-2xl font-semibold text-black mt-6 mb-2">Pilihan Paket Uji:</h3>
      <div class="mb-6 space-y-4">
        <div>
          <h4 class="text-lg font-bold text-gray-900">1. Paket 3 Parameter — <span class="text-emerald-600">Rp. 125.000</span></h4>
          <ul class="list-disc list-inside text-gray-700 pl-4">
            <li>Amphetamine</li>
            <li>THC (tetrahydrocannabinol)</li>
            <li>Morphine</li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-bold text-gray-900">2. Paket 6 Parameter — <span class="text-emerald-600">Rp. 165.000</span></h4>
          <ul class="list-disc list-inside text-gray-700 pl-4">
            <li>Amphetamine</li>
            <li>THC (tetrahydrocannabinol)</li>
            <li>Morphine</li>
            <li>Cocaine</li>
            <li>Methamphetamine</li>
            <li>Benzodiazepines</li>
          </ul>
        </div>
      </div>

      <h3 class="text-2xl font-semibold text-black mt-8 mb-4">Manfaat Layanan:</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Hasil pemeriksaan resmi dari Rumah Sakit</li>
        <li>Proses pengujian urine yang higienis dan valid</li>
        <li>Kerahasiaan data rekam medis pasien terjamin</li>
        <li>Memenuhi syarat administrasi BUMN, Swasta, CPNS, maupun perkuliahan</li>
      </ul>
    `,
    benefits: [
      "Hasil pemeriksaan resmi dari Rumah Sakit",
      "Proses pengujian urine yang higienis dan valid",
      "Kerahasiaan data rekam medis pasien terjamin",
      "Memenuhi syarat administrasi BUMN, Swasta, CPNS, maupun perkuliahan",
    ],
    examinations: [
      "Amphetamine",
      "THC (tetrahydrocannabinol)",
      "Morphine",
      "Cocaine",
      "Methamphetamine",
      "Benzodiazepines",
    ],
  },
];
