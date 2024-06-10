import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ListeItemDemandeMainLevéeProps = {
  appelOffre: string;
  demandéLe: Iso8601DateTime;
  famille?: string;
  identifiantProjet: string;
  statut: GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: string;
  nomProjet: string;
  période: string;
  régionProjet: string;
  showInstruction: boolean;
};

const ConvertStatutMainLeveeForView: Record<
  GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType,
  string
> = {
  demandé: 'Demandé',
  'en-instruction': 'En Instruction',
  accordé: 'Accordé',
  rejeté: 'Rejeté',
};

export const ListItemDemandeMainLevée: FC<ListeItemDemandeMainLevéeProps> = ({
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
          Main levée du projet{' '}
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
        <ul className="mt-3 text-sm">
          <li>
            <span>
              Statut de la demande :{' '}
              <span className="font-semibold capitalize">
                {ConvertStatutMainLeveeForView[statut]}
              </span>
            </span>
          </li>
          <li>
            <span>
              Motif : <span className="font-semibold capitalize">{motif.split('-').join(' ')}</span>
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
        // TODO: ajouter lien vers la demande d'instruction
        <a
          href={Routes.Projet.details(identifiantProjet)}
          className="self-end mt-2"
          aria-label={`voir le détail du projet ${nomProjet}`}
        >
          voir l'instruction
        </a>
      )}
    </div>
  </>
);
