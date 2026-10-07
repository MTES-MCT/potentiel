import Badge from '@codegouvfr/react-dsfr/Badge';
import Tile from '@codegouvfr/react-dsfr/Tile';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { getDemandesLinks } from '@/components/organisms/header/UserBasedRoleNavigation';

type DétailsDemandes = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export type DemandesDétailsProps = {
  autorité: 'dgec' | 'dreal';
  withNew: DétailsDemandes[];
  withNoNew: DétailsDemandes[];
};

export const DemandesDétails = ({ autorité, withNew, withNoNew }: DemandesDétailsProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-row flex-wrap gap-2">
      {withNew.map(({ domain, total, new: newCount }) => (
        <DemandesParDomaine
          key={domain}
          domain={domain}
          total={total}
          new={newCount}
          autorité={autorité}
        />
      ))}
    </div>
    <div className="flex flex-row flex-wrap gap-2">
      {withNoNew.map(({ domain, total, new: newCount }) => (
        <DemandesParDomaine
          key={domain}
          domain={domain}
          total={total}
          new={newCount}
          autorité={autorité}
        />
      ))}
    </div>
  </div>
);

const mapDomaineToLabel: Record<AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction, string> = {
  actionnaire: 'Actionnaires',
  représentantLégal: 'Représentant légal',
  abandon: 'Abandon',
  puissance: 'Puissance',
  délai: 'Délai',
  recours: 'Recours',
};

const DemandesParDomaine = ({
  total,
  new: newCount,
  domain,
  autorité,
}: DétailsDemandes & { autorité: 'dgec' | 'dreal' }) => {
  return (
    <Tile
      className="w-72"
      enlargeLinkOrButton
      linkProps={{
        href: getDemandesLinks({ estPorteur: false, autorité, keys: [domain] })[0]?.url,
      }}
      orientation="horizontal"
      start={
        newCount > 0 && (
          <Badge noIcon severity="info">
            {newCount} nouvelles demandes
          </Badge>
        )
      }
      title={mapDomaineToLabel[domain]}
      desc={total ? `${total} demandes à traiter` : 'Aucune demande à traiter'}
      titleAs="h3"
    />
  );
};
