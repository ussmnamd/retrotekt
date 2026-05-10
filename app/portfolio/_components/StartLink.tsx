'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type Tone = 'primary' | 'secondary' | 'inverse';
type Props = Omit<ComponentProps<typeof Link>, 'className' | 'children'> & {
  label: string;
  tone?: Tone;
  className?: string;
};

const TONES: Record<Tone, { wrapper: string; line: string; lineHover: string; text: string; textHover: string }> = {
  primary:   { wrapper: 'border border-primary/10 bg-primary/[0.04] hover:bg-primary/[0.09] hover:border-primary/20',            line: 'bg-primary/60',    lineHover: 'group-hover:bg-primary',     text: 'text-primary',     textHover: 'group-hover:text-primary' },
  secondary: { wrapper: 'border border-primary/[0.07] bg-primary/[0.03] hover:bg-primary/[0.07] hover:border-primary/15',        line: 'bg-primary/40',    lineHover: 'group-hover:bg-primary/80',  text: 'text-primary/70',  textHover: 'group-hover:text-primary' },
  inverse:   { wrapper: 'border border-[#C4A882]/20 bg-[#F7F0E3]/[0.05] hover:bg-[#F7F0E3]/10 hover:border-[#C4A882]/35',       line: 'bg-background/60', lineHover: 'group-hover:bg-background',  text: 'text-background',  textHover: 'group-hover:text-background' },
};

export default function StartLink({ label, tone = 'primary', className = '', ...rest }: Props) {
  const t = TONES[tone];
  return (
    <Link {...rest} className={`group inline-flex items-center gap-4 px-5 py-[10px] rounded-[3px] transition-colors duration-300 ${t.wrapper} ${className}`}>
      <span aria-hidden className={`block w-5 h-[1.5px] ${t.line} ${t.lineHover} transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-12`} />
      <span className={`font-body font-medium text-[11px] tracking-[0.3em] uppercase ${t.text} ${t.textHover} transition-colors duration-300`}>
        {label}
      </span>
    </Link>
  );
}
