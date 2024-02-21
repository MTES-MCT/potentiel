import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Routes } from '@potentiel-libraries/routes';

export type GarantiesFinancièresListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  /**
   * @todo utiliser un valuetype ici
   */
  statut: 'en attente' | 'validé';
  misÀJourLe: string;
};

const GarantiesFinancièresStatusBadge = ({ statut }: { statut: string }) => (
  <Badge
    noIcon
    severity={statut === 'en attente' ? 'new' : statut === 'validé' ? 'success' : 'info'}
    small={true}
  >
    {statut}
  </Badge>
);

export const GarantiesFinancièresListItem: FC<GarantiesFinancièresListItemProps> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  statut,
  misÀJourLe,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Garanties financières du projet <span className="font-bold">{nomProjet}</span>
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
        <div className="flex flex-col md:flex-row gap-2 mt-3">
          <GarantiesFinancièresStatusBadge statut={statut} />
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <p className="italic text-sm">dernière mise à jour le {misÀJourLe}</p>
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
