import { Schedule } from "@/lib/types";
import type { DoctorWithSchedule, Filters } from "./DoctorScheduleGrid";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// judul dokumen; kosongkan PRINT_ORG kalau tidak ingin ditampilkan
const PRINT_TITLE = "Jadwal Praktik Dokter Rs Medika Lestari";
const PRINT_ORG = "";

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.35;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  header { text-align: center; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #000; }
  .org { margin: 0 0 2px; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  h1 { margin: 0; font-size: 16pt; text-transform: uppercase; letter-spacing: .06em; }
  .meta { margin: 4px 0 0; font-size: 9.5pt; color: #333; }
  section { margin-bottom: 14px; }
  h2 { margin: 0 0 4px; font-size: 11pt; break-after: avoid; page-break-after: avoid; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; text-align: center; }
  thead th { background: #e5e5e5; font-size: 9.5pt; }
  .no { width: 4%; }
  .col-name, .name { width: 26%; text-align: left; }
  .col-day, .day { width: 11.66%; }
  tbody th { background: none; font-size: inherit; font-weight: 700; }
  .off { color: #666; }
  .leave { color: #dc2626; }
  .leave abbr { margin-left: 4px; text-decoration: none; }
  .inactive { background: #e5e5e5; color: #666; text-decoration: line-through; }
  footer { margin-top: 4px; font-size: 8.5pt; color: #333; }
  .legend { display: flex; flex-wrap: wrap; gap: 4px 16px; margin: 0 0 4px; padding: 0; list-style: none; font-weight: 700; }
  .legend .c { color: #dc2626; }
  footer p { margin: 0; }
`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// jam praktik pada satu hari
const getTimes = (schedules: Schedule[] = [], day: string): string[] =>
  schedules
    .filter((s) => s.day_of_week === day)
    .map((s) => `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`);

// satu baris dokter
const buildRow = (
  doctor: DoctorWithSchedule,
  index: number,
  today: string | null,
): string => {
  // cuti hanya tampil jika dokter praktik hari ini
  const onLeave =
    doctor.status === "cuti" &&
    !!today &&
    getTimes(doctor.schedules, today).length > 0;

  const cells = DAYS.map((day) => {
    const times = getTimes(doctor.schedules, day);
    if (times.length === 0) return `<td class="day off">&ndash;</td>`;

    const inactive = onLeave && day === today ? " inactive" : "";
    return `<td class="day${inactive}">${times.map(escapeHtml).join("<br>")}</td>`;
  }).join("");

  const leaveMark = onLeave ? `<abbr title="Cuti">(C)</abbr>` : "";

  return `<tr>
    <td class="no">${index + 1}</td>
    <th scope="row" class="name${onLeave ? " leave" : ""}">${escapeHtml(doctor.name)}${leaveMark}</th>
    ${cells}
  </tr>`;
};

// satu bagian per spesialis
const buildSection = (
  specialty: string,
  doctors: DoctorWithSchedule[],
  today: string | null,
): string => {
  const head = DAYS.map(
    (day) => `<th scope="col" class="col-day">${day}</th>`,
  ).join("");
  const rows = doctors.map((doc, i) => buildRow(doc, i, today)).join("");

  return `
    <section>
      <h2>Dokter ${escapeHtml(specialty)}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col" class="no">No</th>
            <th scope="col" class="col-name">Nama Dokter</th>
            ${head}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
};

// teks filter yang sedang dipakai
const buildFilterText = (filters: Filters): string => {
  const parts: string[] = [];
  if (filters.specialty) parts.push(`Spesialis: ${filters.specialty}`);
  if (filters.day) parts.push(`Hari praktik: ${filters.day}`);
  if (filters.name.trim()) parts.push(`Nama: "${filters.name.trim()}"`);

  return parts.length ? parts.join("  |  ") : "Semua dokter";
};

// dokumen cetak: dikelompokkan per spesialis, urut abjad
const buildPrintHtml = (
  doctors: DoctorWithSchedule[],
  filters: Filters,
  today: string | null,
  printedAt: string,
): string => {
  const sorted = [...doctors].sort(
    (a, b) =>
      a.specialty.localeCompare(b.specialty) || a.name.localeCompare(b.name),
  );

  const groups = new Map<string, DoctorWithSchedule[]>();
  for (const doc of sorted) {
    const list = groups.get(doc.specialty);
    if (list) list.push(doc);
    else groups.set(doc.specialty, [doc]);
  }

  const sections = Array.from(groups, ([specialty, list]) =>
    buildSection(specialty, list, today),
  ).join("");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(PRINT_TITLE)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <header>
    ${PRINT_ORG ? `<p class="org">${escapeHtml(PRINT_ORG)}</p>` : ""}
    <h1>${escapeHtml(PRINT_TITLE)}</h1>
    <p class="meta">${escapeHtml(buildFilterText(filters))}</p>
  </header>
  <main>${sections}</main>
  <footer>
    <ul class="legend">
      <li>(*) Poliklinik Eksekutif</li>
      <li>(P) Dokter Sedang Praktik</li>
      <li class="c">(C) Cuti</li>
      <li>&ndash; Tidak praktik</li>
    </ul>
    <p>Dicetak pada ${escapeHtml(printedAt)}</p>
  </footer>
</body>
</html>`;
};

// cetak lewat iframe tersembunyi supaya navbar dan footer situs tidak ikut
const printHtml = (html: string) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";

  let removed = false;
  const cleanup = () => {
    if (removed) return;
    removed = true;
    iframe.remove();
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) return cleanup();
    win.addEventListener("afterprint", cleanup);
    win.focus();
    win.print();
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  // cadangan kalau afterprint tidak terpanggil
  setTimeout(cleanup, 60_000);
};

// cetak semua dokter hasil filter
export const printSchedule = (
  doctors: DoctorWithSchedule[],
  filters: Filters,
  today: string | null,
) => {
  if (doctors.length === 0) return;

  const printedAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  printHtml(buildPrintHtml(doctors, filters, today, printedAt));
};
