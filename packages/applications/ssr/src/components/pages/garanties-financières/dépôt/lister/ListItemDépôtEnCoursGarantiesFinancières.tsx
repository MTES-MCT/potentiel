import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedForPageDate } from '@/utils/displayDate';

export type ListItemDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  statut: GarantiesFinancières.StatutDépôtGarantiesFinancières.RawType;
  type: string;
  dateÉchéance?: FormattedForPageDate;
  misÀJourLe: FormattedForPageDate;
  régionProjet: string;
};

export const ListItemDépôtEnCoursGarantiesFinancières: FC<
  ListItemDépôtEnCoursGarantiesFinancièresProps
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
  régionProjet,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Garanties financières du projet <span className="font-bold mr-3">{nomProjet}</span>{' '}
          <Badge noIcon severity={'new'} small={true}>
            {statut}
          </Badge>
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
          {régionProjet && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Région : {régionProjet}
            </div>
          )}
        </div>
        <ul className="mt-3 text-sm">
          <li>
            {type ? (
              <span>
                Type : <span className="font-semibold">{type}</span>
              </span>
            ) : (
              'Type de garanties financières à compléter'
            )}
          </li>
          {dateÉchéance && (
            <li>
              Date d'échéance : <span className="font-semibold">{dateÉchéance}</span>
            </li>
          )}
        </ul>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">dernière mise à jour le {misÀJourLe}</p>
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
