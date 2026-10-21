import Badge from '@codegouvfr/react-dsfr/Badge';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Tile from '@codegouvfr/react-dsfr/Tile';
import BadgeMui from '@mui/material/Badge';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { getDemandesLinks } from '@/components/organisms/header/UserBasedRoleNavigation/getDemandesLinks';

export type DétailsDemandes = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

export type DemandesDétailsProps = {
  autorité: 'dgec' | 'dreal';
  avecNouvellesDemandes: DétailsDemandes[];
  sansNouvellesDemandes: DétailsDemandes[];
};

export const DemandesDétails = ({
  autorité,
  avecNouvellesDemandes,
  sansNouvellesDemandes,
}: DemandesDétailsProps) => (
  <div className="flex flex-col gap-4">
    {withNew.length ? (
      <Notice
        severity="info"
        title=""
        description="Une demande récente est une demande datant de moins d'un mois."
        className="w-fit"
      />
    ) : null}
    <div className="flex flex-row flex-wrap gap-2">
      {avecNouvellesDemandes.map(({ domain, total, new: newCount }) => (
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
      {sansNouvellesDemandes.map(({ domain, total, new: newCount }) => (
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
        'aria-label': `Voir les demandes de ${mapDomaineToLabel[domain]}${newCount > 0 ? ` (${newCount} demande(s) récente(s))` : ''}`,
      }}
      orientation="horizontal"
      start={
        newCount > 0 && (
          <Badge noIcon severity="info">
            New
          </Badge>
        )
      }
      title={
        <div className="flex flex-row items-center gap-8">
          {mapDomaineToLabel[domain]}
          <BadgeMui badgeContent={total} max={99} color="primary" overlap="circular" />
        </div>
      }
      desc={
        <>
          <span className="italic text-sm">
            {total
              ? `${total} ${total > 1 ? 'demandes' : 'demande'} à traiter`
              : `Aucune demande à
          traiter`}
          </span>
          <span className="italic text-sm">
            {' '}
            {newCount > 0 && `dont ${newCount} ${newCount > 1 ? 'récentes' : ' récente'}`}
          </span>
        </>
      }
      titleAs="h3"
    />
  );
};
