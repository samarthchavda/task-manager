import React from 'react';

const DashboardCard = ({ title, value, icon, tone = 'slate' }) => {
  const tones = {
    slate: {
      card: 'border-slate-200 bg-white',
      badge: 'bg-slate-100 text-slate-700',
      value: 'text-slate-900',
    },
    indigo: {
      card: 'border-indigo-200 bg-indigo-50/60',
      badge: 'bg-indigo-100 text-indigo-700',
      value: 'text-indigo-900',
    },
    sky: {
      card: 'border-sky-200 bg-sky-50/60',
      badge: 'bg-sky-100 text-sky-700',
      value: 'text-sky-900',
    },
    zinc: {
      card: 'border-zinc-200 bg-zinc-50/70',
      badge: 'bg-zinc-200 text-zinc-700',
      value: 'text-zinc-900',
    },
  };

  const palette = tones[tone] || tones.slate;

  return (
    <div className={`rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${palette.card}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`mt-2 text-3xl font-semibold ${palette.value}`}>{value}</p>
        </div>
        <div className={`rounded-lg px-3 py-1 text-xs font-semibold tracking-wide ${palette.badge}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
