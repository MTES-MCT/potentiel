import { fr } from '@codegouvfr/react-dsfr';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Tile from '@codegouvfr/react-dsfr/Tile';
import clsx from 'clsx';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { getDemandesLinks } from '@/components/organisms/header/UserBasedRoleNavigation/getDemandesLinks';

export type DétailsDemandes = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export type DemandesDétailsProps = {
  autorité: 'dgec' | 'dreal';
  demandes: DétailsDemandes[];
};

export const DemandesDétails = ({ autorité, demandes }: DemandesDétailsProps) => (
  <div className="flex flex-col gap-4">
    <Notice
      severity="info"
      title=""
      description="Une demande récente est une demande datant de moins d'un mois."
      className="w-fit"
    />
    <div className="flex flex-row flex-wrap gap-2">
      {demandes.map(({ domain, total, new: newCount }) => (
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
  actionnaire: 'Actionnaire',
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
        'aria-label': `Voir les demandes de ${mapDomaineToLabel[domain]}${newCount > 0 ? ` (${newCount} demande(s) récente(s))` : ''}`,
      }}
      orientation="horizontal"
      title={mapDomaineToLabel[domain]}
      desc={
        total ? (
          <>
            <span className="font-semibold">
              {total} {total > 1 ? 'demandes' : 'demande'} à instruire
            </span>
            {newCount > 0 && (
              <>
                <br />
                <span className={clsx(fr.cx('fr-text--sm', 'fr-notice--info'), 'px-1')}>
                  {newCount === 1
                    ? 'dont une demande récente'
                    : `dont ${newCount} demandes récentes`}
                </span>
              </>
            )}
          </>
        ) : (
          'Aucune demande à instruire'
        )
      }
      titleAs="h3"
    />
  );
};
