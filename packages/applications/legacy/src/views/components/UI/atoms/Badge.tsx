import React, { FC } from 'react';

export type BadgeType = 'success' | 'error' | 'info' | 'warning';

type BadgeProps = {
  className?: string;
  type: BadgeType;
};

const badgeColorsByType: Record<
  BadgeType,
  { backgroundColor: string; borderColor: string; textColor: string }
> = {
  success: {
    backgroundColor: 'bg-success-950-base',
    borderColor: 'border-success-950-base',
    textColor: 'text-success-425-base',
  },
  error: {
    backgroundColor: 'bg-error-950-base',
    borderColor: 'border-error-950-base',
    textColor: 'text-error-425-base',
  },
  info: {
    backgroundColor: 'bg-info-950-base',
    borderColor: 'border-info-950-base',
    textColor: 'text-info-425-base',
  },
  warning: {
    backgroundColor: 'bg-warning-950-base',
    borderColor: 'border-warning-950-base',
    textColor: 'text-warning-425-base',
  },
};

export const Badge: FC<BadgeProps & { children: React.ReactNode }> = ({
  type,
  className = '',
  children,
}) => {
  const { backgroundColor, textColor, borderColor } = badgeColorsByType[type];
  return (
    <span
      className={`inline-block self-start px-2 py-0.5 rounded-md text-sm font-bold uppercase ${backgroundColor} ${textColor} print:border-solid print:border-2 print:${borderColor} ${className}`}
    >
      {children}
    </span>
  );
};
