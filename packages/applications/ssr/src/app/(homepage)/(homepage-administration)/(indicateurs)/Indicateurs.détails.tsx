import Tile from '@codegouvfr/react-dsfr/Tile';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

export type IndicateursDétailsProps = {
  garantiesFinancières: Lauréat.GarantiesFinancières.ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel;
};

export const IndicateursDétails = ({ garantiesFinancières }: IndicateursDétailsProps) => (
  <div className="flex flex-row flex-wrap gap-2">
    <IndicateurTile
      titre="Projets sans garanties financières"
      href={Routes.GarantiesFinancières.enAttente.lister({ statut: 'actif' })}
      total={garantiesFinancières.projetEnAttente.total}
    />
  </div>
);

type IndicateurTileProps = {
  titre: string;
  href: string;
  total: number;
};

const IndicateurTile = ({ titre, href, total }: IndicateurTileProps) => (
  <Tile
    className="w-72"
    enlargeLinkOrButton
    linkProps={{ href, 'aria-label': `Voir les ${titre.toLowerCase()}` }}
    orientation="horizontal"
    title={titre}
    desc={<span className="font-semibold">{total}</span>}
    titleAs="h3"
  />
);
