import { type ReactNode } from 'react';

export default function AdminBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-bold text-[#003ea8]">
      {children}
    </span>
  );
}
