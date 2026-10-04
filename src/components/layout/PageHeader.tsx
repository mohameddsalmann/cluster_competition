import React from 'react';

interface PageHeaderProps {
  title: string;
  breadcrumbs: string[];
  actionSlot?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  actionSlot,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#e2e8f0] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-bold text-[#1e293b] tracking-tight font-sans">
          {title}
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">-</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'text-slate-600 font-semibold' : 'text-slate-400'}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {actionSlot && <div className="flex items-center gap-2">{actionSlot}</div>}
    </div>
  );
};
