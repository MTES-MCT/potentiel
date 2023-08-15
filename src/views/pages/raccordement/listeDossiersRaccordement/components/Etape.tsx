import React, { FC } from 'react';
import { ClockIcon, SuccessIcon, WarningIcon } from '../../../../components';

export const Etape: FC<{
  statut: 'étape validée' | 'étape à venir' | 'étape incomplète';
  titre: string;
  className?: string;
}> = ({ statut, titre, children, className = '' }) => {
  let icon;
  let borderColor;
  let backgroundColor;

  switch (statut) {
    case 'étape validée':
      icon = (
        <SuccessIcon className="w-8 h-8 md:mx-auto text-success-425-base" title="étape validée" />
      );
      borderColor = 'border-success-425-base';
      backgroundColor = 'bg-green-50';
      break;
    case 'étape incomplète':
      icon = (
        <WarningIcon
          className="w-8 h-8 md:mx-auto text-warning-425-base"
          title="étape incomplète"
        />
      );
      borderColor = 'border-warning-425-base';
      backgroundColor = 'bg-warning-975-base';
      break;
    case 'étape à venir':
      icon = <ClockIcon className="w-8 h-8 md:mx-auto text-grey-625-base" title="étape à venir" />;
      borderColor = 'border-grey-625-base';
      backgroundColor = '';
      break;
    default:
      icon = null;
      borderColor = '';
      backgroundColor = '';
      break;
  }

  return (
    <div
      className={`flex flex-col p-5 border-2 border-solid md:w-1/3 ${borderColor} ${backgroundColor}
      ${className}`}
    >
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        {icon}
        <div className="uppercase font-bold text-sm">{titre}</div>
      </div>
      {children}
    </div>
  );
};
