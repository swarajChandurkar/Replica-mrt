import { useState } from 'react';
import { Scissors } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2F1EE] to-[#E5E3DD] text-[#595959] p-6 text-center ${className}`}
      >
        <Scissors className="w-6 h-6 mb-2 opacity-60" aria-hidden="true" />
        <span className="font-display text-sm tracking-wide text-[#1C1C1C]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
