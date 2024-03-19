import { FC } from 'react';
import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';

import { Routes } from '@potentiel-libraries/routes';

import { formatDateForText } from '@/utils/formatDateForText';

import { DépôtStatut } from '../../détails/components/GarantiesFinancièresHistoriqueDépôts';

export type GarantiesFinancièresDépôtsEnCoursListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  statut: DépôtStatut;
  type: string;
  dateÉchéance?: string;
  misÀJourLe: string;
};

const GarantiesFinancièresStatusBadge = ({
  statut,
}: {
  statut: GarantiesFinancièresDépôtsEnCoursListItemProps['statut'];
}) => {
  const getSeverity = (
    statut: GarantiesFinancièresDépôtsEnCoursListItemProps['statut'],
  ): BadgeProps['severity'] => {
    switch (statut) {
      case 'en-cours':
        return 'new';
      case 'rejeté':
        return 'error';
      case 'validé':
        return 'success';
    }
  };

  return (
    <Badge noIcon severity={getSeverity(statut)} small={true}>
      {statut}
    </Badge>
  );
};

export const GarantiesFinancièresDépôtsEnCoursListItem: FC<
  GarantiesFinancièresDépôtsEnCoursListItemProps
> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  statut,
  misÀJourLe,
  type,
  dateÉchéance,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Garanties financières du projet <span className="font-bold mr-3">{nomProjet}</span>{' '}
          <GarantiesFinancièresStatusBadge statut={statut} />
        </h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
          <div>
            Appel d'offres : {appelOffre}
            <span className="hidden md:inline-block mr-2">,</span>
          </div>
          <div>Période : {période}</div>
          {famille && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Famille : {famille}
            </div>
          )}
        </div>
        <ul className="mt-3 text-sm">
          <li>
            Type : <span className="font-semibold">{type}</span>
          </li>
          {dateÉchéance && (
            <li>
              Date d'échéance :{' '}
              <span className="font-semibold">{formatDateForText(dateÉchéance)}</span>
            </li>
          )}
        </ul>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">dernière mise à jour le {formatDateForText(misÀJourLe)}</p>
      <a
        href={Routes.GarantiesFinancières.détail(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail des garanties financières en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </a>
    </div>
  </>
);
