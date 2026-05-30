import { type ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
}

export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => (
            <tr key={index} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
