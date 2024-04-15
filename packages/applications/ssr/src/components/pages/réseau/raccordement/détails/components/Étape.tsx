import { FC } from 'react';

import { Icon } from '@/components/atoms/Icon';

type EtapeProps = {
  statut: 'étape validée' | 'étape à venir' | 'étape incomplète';
  titre: string;
  className?: string;
  children: React.ReactNode;
};

export const Etape: FC<EtapeProps> = ({ statut, titre, children, className = '' }) => {
  let icon;
  let borderColor;
  let backgroundColor;

  switch (statut) {
    case 'étape validée':
      icon = (
        <Icon
          id="fr-icon-success-fill"
          size="lg"
          className="md:mx-auto text-options-success-_425_625-default"
          title="étape validée"
        />
      );
      borderColor = 'border-options-success-_425_625-default';
      backgroundColor = 'bg-decisions-background-contrast-success-default';
      break;
    case 'étape incomplète':
      icon = (
        <Icon
          id="fr-icon-alert-fill"
          size="lg"
          className="md:mx-auto text-options-warning-_425_625-default"
          title="étape incomplète"
        />
      );
      borderColor = 'border-options-warning-_425_625-default';
      backgroundColor = 'border-decisions-background-contrast-warning-default';
      break;
    case 'étape à venir':
      icon = (
        <Icon
          id="fr-icon-time-line"
          size="lg"
          className="md:mx-auto text-options-grey-_625_425-default"
          title="étape à venir"
        />
      );
      borderColor = 'border--options-grey-_625_425-default';
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
