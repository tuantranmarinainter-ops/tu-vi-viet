'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns } from '@/lib/ziwei/patterns';
import { viLabel } from '@/lib/i18n/vi';

const LevelStyle = {
  excellent: { dot: 'bg-amber-400', label: 'text-amber-500', badge: 'text-amber-500 bg-amber-500/10 border-amber-500/25' },
  good:      { dot: 'bg-sky-400',   label: 'text-sky-500',   badge: 'text-sky-500 bg-sky-500/10 border-sky-500/25' },
  neutral:   { dot: 'bg-slate-400', label: 'text-slate-400', badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  caution:   { dot: 'bg-orange-500', label: 'text-orange-500', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
};

const containsChinese = (value: string) => /[\u3400-\u9fff]/.test(value);

function translatedOrFallback(value: string, fallback: string): string {
  const translated = viLabel(value);
  return containsChinese(translated) ? fallback : translated;
}

export default function PatternsCard({ chart }: { chart: ZiweiChart }) {
  const patterns = detectPatterns(chart);
  if (patterns.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glass rounded-xl p-4 mb-4"
    >
      <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
        <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◉</span>
        Cách cục (theo điều kiện cổ thư)
        <span className="text-[10px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{patterns.length} mục</span>
      </div>
      <div className="space-y-2">
        {patterns.map((p, i) => {
          const st = LevelStyle[p.level];
          const displayName = translatedOrFallback(p.name, `Cách cục ${i + 1}`);
          const displayDescription = translatedOrFallback(p.description, 'Bản dịch mô tả chưa có; xem phần nguyên văn.');
          const displayRequired = p.conditions?.required.length
            ? translatedOrFallback(p.conditions.required.join('、'), 'Xem điều kiện trong phần nguyên văn.')
            : '';
          const displayBonus = p.conditions?.bonus?.length
            ? translatedOrFallback(p.conditions.bonus.join('、'), 'Xem điều kiện trong phần nguyên văn.')
            : '';
          const displayBreaking = p.conditions?.breaking?.length
            ? translatedOrFallback(p.conditions.breaking.join('、'), 'Xem điều kiện trong phần nguyên văn.')
            : '';
          return (
            <motion.div
              key={`${p.name}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-inner rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                <span className={`text-[11px] font-medium ${st.label}`}>{displayName}</span>
                <div className="flex gap-1 ml-auto">
                  {p.palaces.slice(0, 2).map(pa => (
                    <span key={pa} className={`text-[8px] px-1.5 py-px rounded-full border ${st.badge}`}>
                      {translatedOrFallback(pa.replace('宫', ''), 'Cung')}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[10px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                {displayDescription}
              </p>

              {p.conditions && (
                <div className="mt-2 pl-3.5 space-y-0.5">
                  {p.conditions.required.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium" style={{ color: 'var(--t-gold)' }}>Điều kiện cần</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {displayRequired}
                    </div>
                  )}
                  {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium text-emerald-500">Điểm cộng</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {displayBonus}
                    </div>
                  )}
                  {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium text-orange-500">Phá cách</span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {displayBreaking}
                    </div>
                  )}
                </div>
              )}

              <details className="mt-2 pl-3.5 text-[9px] leading-relaxed" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
                <summary className="cursor-pointer">Nguyên văn cách cục</summary>
                <div className="mt-1 space-y-1">
                  <div>{p.name}</div>
                  <div>{p.description}</div>
                  {p.conditions?.required.length ? <div>Điều kiện cần (nguyên văn): {p.conditions.required.join('、')}</div> : null}
                  {p.conditions?.bonus?.length ? <div>Điểm cộng (nguyên văn): {p.conditions.bonus.join('、')}</div> : null}
                  {p.conditions?.breaking?.length ? <div>Phá cách (nguyên văn): {p.conditions.breaking.join('、')}</div> : null}
                  {p.source ? <div>Nguồn: {p.source}</div> : null}
                </div>
              </details>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
