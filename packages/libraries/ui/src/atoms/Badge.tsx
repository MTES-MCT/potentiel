import React, { FC } from 'react';

export type BadgeType = 'success' | 'error' | 'info' | 'warning';

type BadgeProps = {
  className?: string;
  type: BadgeType;
};

const badgeColorsByType: Record<BadgeType, { backgroundColor: string; textColor: string }> = {
  success: {
    backgroundColor: 'bg-success-950-base',
    textColor: 'text-success-425-base',
  },
  error: {
    backgroundColor: 'bg-error-950-base',
    textColor: 'text-error-425-base',
  },
  info: {
    backgroundColor: 'bg-info-950-base',
    textColor: 'text-info-425-base',
  },
  warning: {
    backgroundColor: 'bg-warning-950-base',
    textColor: 'text-warning-425-base',
  },
};

export const Badge: FC<BadgeProps> = ({ type, className = '', children }) => {
  const { backgroundColor, textColor } = badgeColorsByType[type];
  return (
    <span
      className={`inline-flex self-start px-2 py-0.5 rounded-md text-sm font-bold uppercase ${backgroundColor} ${textColor} ${className}`}
    >
      {children}
    </span>
  );
};
