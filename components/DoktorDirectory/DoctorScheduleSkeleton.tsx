// Skeleton ini meniru DoctorScheduleGrid: form filter, baris keterangan + Print,
// judul grup spesialis, tabel jadwal (desktop) / daftar (layar kecil), dan pagination.

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const GROUPS = [
  { id: "spec-1", rows: ["doc-1", "doc-2", "doc-3", "doc-4"] },
  { id: "spec-2", rows: ["doc-5", "doc-6", "doc-7"] },
];

const PAGES = ["p-1", "p-2", "p-3", "p-4"];

const bar = "rounded bg-slate-200";

function FieldSkeleton({ labelWidth }: Readonly<{ labelWidth: string }>) {
  return (
    <div>
      {/* tinggi sama dengan label asli (text-sm + mb-1.5) */}
      <div className="mb-1.5 flex h-5 items-center">
        <div className={`h-3.5 ${labelWidth} ${bar}`} />
      </div>
      <div className="h-11 rounded-md border border-slate-300 bg-white" />
    </div>
  );
}

function TableSkeleton({ rows }: Readonly<{ rows: string[] }>) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[24%]" />
          {DAYS.map((day) => (
            <col key={day} />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-slate-50">
            <th className="px-4 py-3 text-left">
              <div className={`h-4 w-28 ${bar}`} />
            </th>
            {DAYS.map((day) => (
              <th key={day} className="px-2 py-3">
                <div className={`mx-auto h-4 w-12 ${bar}`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} className="border-t border-slate-200 align-top">
              <td className="px-4 py-3">
                <div className={`h-4 w-4/5 ${bar}`} />
              </td>
              {DAYS.map((day) => (
                <td key={`${row}-${day}`} className="px-2 py-3">
                  <div className="mx-auto h-4 w-20 rounded bg-slate-100" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListSkeleton({ rows }: Readonly<{ rows: string[] }>) {
  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-4 lg:hidden">
      {rows.map((row) => (
        <li key={row} className="py-3">
          <div className={`h-4 w-3/5 ${bar}`} />
          <div className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {DAYS.slice(0, 4).map((day) => (
              <div key={`${row}-${day}`} className="flex justify-between gap-3">
                <div className="h-3.5 w-14 rounded bg-slate-100" />
                <div className={`h-3.5 w-24 ${bar}`} />
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DoctorScheduleSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="w-full animate-pulse space-y-6 motion-reduce:animate-none"
    >
      <span className="sr-only">Memuat jadwal dokter...</span>

      <div aria-hidden="true" className="space-y-6">
        {/* FORM FILTER */}
        <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
          <FieldSkeleton labelWidth="w-24" />
          <FieldSkeleton labelWidth="w-16" />
          <FieldSkeleton labelWidth="w-20" />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <div className="h-11 flex-1 rounded-md bg-slate-200 lg:w-24 lg:flex-none" />
          </div>
        </div>

        {/* KETERANGAN TANDA + PRINT */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className={`h-4 w-64 max-w-full ${bar}`} />
          <div className={`h-4 w-28 ${bar}`} />
        </div>

        {/* GRUP SPESIALIS + TABEL */}
        <div className="space-y-8">
          {GROUPS.map((group, gi) => (
            // grup kedua disembunyikan di layar kecil supaya tidak terlalu panjang
            <div key={group.id} className={gi > 0 ? "hidden sm:block" : ""}>
              <div className="mb-3 flex items-baseline justify-between gap-4 border-b-2 border-slate-200 pb-2">
                <div className="h-6 w-48 max-w-[60%] rounded bg-slate-200" />
                
              </div>

              <TableSkeleton rows={group.rows} />
              <ListSkeleton rows={group.rows.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-1 pt-4 sm:gap-2">
          <div className="h-11 w-11 rounded-lg border border-slate-200 sm:h-12 sm:w-12" />
          {PAGES.map((p) => (
            <div
              key={p}
              className="h-10 w-10 rounded-lg bg-slate-200 sm:h-12 sm:w-12"
            />
          ))}
          <div className="h-11 w-11 rounded-lg border border-slate-200 sm:h-12 sm:w-12" />
        </div>
      </div>
    </div>
  );
}
