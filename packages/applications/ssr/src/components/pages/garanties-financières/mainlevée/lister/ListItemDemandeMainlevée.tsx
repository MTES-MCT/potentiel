import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutMainlevéeBadge } from '@/components/molecules/mainlevée/StatutMainlevéeBadge';

import { convertMotifMainlevéeForView } from '../convertForView';

export type ListItemDemandeMainlevéeProps = {
  appelOffre: string;
  demandéLe: Iso8601DateTime;
  famille?: string;
  identifiantProjet: string;
  statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: string;
  nomProjet: string;
  période: string;
  régionProjet: string;
  showInstruction: boolean;
};

export const ListItemDemandeMainlevée: FC<ListItemDemandeMainlevéeProps> = ({
  appelOffre,
  demandéLe,
  famille,
  identifiantProjet,
  misÀJourLe,
  motif,
  nomProjet,
  période,
  régionProjet,
  statut,
  showInstruction,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Mainlevée du projet{' '}
          <a
            href={Routes.Projet.details(identifiantProjet)}
            className="font-bold mr-3"
            aria-label={`voir le détail du projet ${nomProjet}`}
          >
            {nomProjet}
          </a>{' '}
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
        <StatutMainlevéeBadge statut={statut} />
        <ul className="mt-3 text-sm">
          <li>
            <span>
              Motif :{' '}
              <span className="font-semibold capitalize">
                {convertMotifMainlevéeForView(motif)}
              </span>
            </span>
          </li>
          <li>
            <span>
              Date de la demande : <FormattedDate className="font-semibold" date={demandéLe} />
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">
        dernière mise à jour le <FormattedDate date={misÀJourLe} />
      </p>
      {showInstruction && (
        <a
          href={Routes.GarantiesFinancières.détail(identifiantProjet)}
          className="self-end mt-2"
          aria-label={`instruire`}
        >
          Instruire
        </a>
      )}
    </div>
  </>
);
