import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={`block ${className}`}>
        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
          <Image
            src="/tejas-logo.jpg"
            alt="TEJAS Institute"
            fill
            sizes="40px"
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
          <Image
            src="/tejas-logo.jpg"
            alt="TEJAS Institute"
            fill
            sizes="36px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-black tracking-tight text-foreground font-display">
            TEJAS
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Institute
          </span>
        </div>
      </Link>
    );
  }

  // Full variant
  return (
    <Link href="/" className={`flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}>
      <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl shadow-md">
        <Image
          src="/tejas-logo.jpg"
          alt="TEJAS Institute of Advanced Technology"
          fill
          sizes="(max-width: 640px) 36px, 44px"
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-sm sm:text-base font-black tracking-tight text-foreground font-display">
          TEJAS
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] truncate">
          <span className="2xl:hidden">Institute</span>
          <span className="hidden 2xl:inline">Institute of Advanced Technology</span>
        </span>
      </div>
    </Link>
  );
}
