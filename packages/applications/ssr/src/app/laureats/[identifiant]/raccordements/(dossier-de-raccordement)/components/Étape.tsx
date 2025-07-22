import { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { match } from 'ts-pattern';
import clsx from 'clsx';

import { Icon } from '@/components/atoms/Icon';

type EtapeProps = {
  statut: 'étape validée' | 'étape à venir' | 'étape incomplète';
  titre: string;
  className?: string;
  children: React.ReactNode;
};

export const Etape: FC<EtapeProps> = ({ statut, titre, children, className = '' }) => {
  const { iconId, iconColor, backgroundColor, borderColor } = match(statut)
    .with(
      'étape validée',
      () =>
        ({
          iconId: 'fr-icon-success-fill',
          iconColor: fr.colors.decisions.text.default.success.default,
          borderColor: fr.colors.decisions.border.actionHigh.success.default,
          backgroundColor: fr.colors.decisions.background.contrast.success.default,
        }) as const,
    )
    .with(
      'étape incomplète',
      () =>
        ({
          iconId: 'fr-icon-alert-fill',
          iconColor: fr.colors.decisions.text.default.warning.default,
          borderColor: fr.colors.decisions.border.actionHigh.warning.default,
          backgroundColor: fr.colors.decisions.background.contrast.warning.default,
        }) as const,
    )
    .with(
      'étape à venir',
      () =>
        ({
          iconId: 'fr-icon-time-line',
          iconColor: fr.colors.decisions.text.default.grey.default,
          borderColor: fr.colors.decisions.border.default.grey.default,
          backgroundColor: '',
        }) as const,
    )
    .exhaustive();

  return (
    <div
      className={clsx(`flex flex-col p-5 border-2 border-solid md:w-1/3`, className)}
      style={{ borderColor, backgroundColor }}
    >
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        <Icon
          size="lg"
          title={statut}
          id={iconId}
          className={clsx('md:mx-auto')}
          style={{ color: iconColor }}
        />
        <div className="uppercase font-bold text-sm">{titre}</div>
      </div>
      {children}
    </div>
  );
};
