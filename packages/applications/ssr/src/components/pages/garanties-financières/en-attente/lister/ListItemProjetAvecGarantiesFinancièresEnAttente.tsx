import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { formatDateForText } from '@/utils/formatDateForText';

export type ListItemProjetAvecGarantiesFinancièresEnAttenteProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  régionProjet: string;
  misÀJourLe: string;
};

export const ListItemProjetAvecGarantiesFinancièresEnAttente: FC<
  ListItemProjetAvecGarantiesFinancièresEnAttenteProps
> = ({ identifiantProjet, nomProjet, appelOffre, période, famille, régionProjet, misÀJourLe }) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Garanties financières du projet <span className="font-bold mr-3">{nomProjet}</span>{' '}
          <Badge noIcon severity={'error'} small={true}>
            en-attente
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
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">Dernière mise à jour le {formatDateForText(misÀJourLe)}</p>
      <Link
        href={Routes.Projet.details(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail du projet ${nomProjet}`}
      >
        voir le projet
      </Link>
    </div>
  </>
);
