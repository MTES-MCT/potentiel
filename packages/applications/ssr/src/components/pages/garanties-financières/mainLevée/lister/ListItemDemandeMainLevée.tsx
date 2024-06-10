import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ListeItemDemandeMainLevéeProps = {
  identifiantProjet: string;
  motif: string;
  nomProjet: string;
  demandéLe: Iso8601DateTime;
  misÀJourLe: Iso8601DateTime;
};

export const ListItemDemandeMainLevée: FC<ListeItemDemandeMainLevéeProps> = ({
  identifiantProjet,
  motif,
  nomProjet,
  demandéLe,
  misÀJourLe,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Main levée du projet <span className="font-bold mr-3">{nomProjet}</span>{' '}
        </h2>
        {/* <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
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
        </div> */}
        <ul className="mt-3 text-sm">
          <li>
            <span>
              Motif : <span className="font-semibold capitalize">{motif.split('-').join(' ')}</span>
            </span>
          </li>
          <li>
            Date de la demande : <FormattedDate className="font-semibold" date={demandéLe} />
          </li>
        </ul>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">
        dernière mise à jour le <FormattedDate date={misÀJourLe} />
      </p>
      <a
        href={Routes.Projet.details(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail du projet ${nomProjet}`}
      >
        voir le détail
      </a>
    </div>
  </>
);
