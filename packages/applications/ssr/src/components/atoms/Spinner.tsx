import clsx from 'clsx';
import { FC } from 'react';

export type SpinnerProps = {
  className?: string;
  size: 'small' | 'medium' | 'large';
};

export const Spinner: FC<SpinnerProps> = ({ className, size }) => {
  const sizeClasses: Record<SpinnerProps['size'], string> = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div
      className={clsx(
        `inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-theme-blueFrance border-b-[transparent]`,
        sizeClasses[size],
        className,
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
