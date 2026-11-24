import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { Lauréat } from '@potentiel-domain/projet';

import { getDemandesLinks } from '@/components/organisms/header/UserBasedRoleNavigation/getDemandesLinks';
import { DemandeTile, type DemandeTileProps } from './DemandeTile';

export type DétailsDemandes = {
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
};

type NombreGarantiesFinancièresÀInstruire =
  Lauréat.GarantiesFinancières.ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel;

export type DemandesDétailsProps = {
  autorité: 'dgec' | 'dreal';
  demandes: DétailsDemandes[];
  garantiesFinancières?: NombreGarantiesFinancièresÀInstruire;
};

export const DemandesDétails = ({
  autorité,
  demandes,
  garantiesFinancières,
}: DemandesDétailsProps) => (
  <div className="flex flex-col gap-4">
    <Notice
      severity="info"
      title=""
      description="Une demande récente est une demande datant de moins d'un mois."
      className="w-fit"
    />
    <div className="flex flex-row flex-wrap gap-2">
      {demandes.map(({ domain, total, new: newCount }) => (
        <DemandeTile
          key={domain}
          titre={mapDomaineToLabel[domain]}
          ariaLabel={`Voir les demandes de ${mapDomaineToLabel[domain]}`}
          href={getDemandesLinks({ estPorteur: false, autorité, keys: [domain] })[0]?.url}
          total={total}
          new={newCount}
        />
      ))}
      {garantiesFinancières &&
        garantiesFinancièresTiles.map(({ key, ...tile }) => (
          <DemandeTile
            key={key}
            {...tile}
            total={garantiesFinancières[key].total}
            new={garantiesFinancières[key].new}
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

type GarantiesFinancièresTile = Omit<DemandeTileProps, 'total' | 'new'> & {
  key: keyof NombreGarantiesFinancièresÀInstruire;
};

const garantiesFinancièresTiles: GarantiesFinancièresTile[] = [
  {
    key: 'dépôt',
    titre: 'Garanties financières',
    ariaLabel: 'Voir les demandes de garanties financières',
    href: Routes.GarantiesFinancières.dépôt.lister(),
  },
  {
    key: 'demandeMainlevée',
    titre: 'Mainlevée des garanties financières',
    ariaLabel: 'Voir les demandes de mainlevée',
    href: Routes.GarantiesFinancières.demandeMainlevée.lister({
      statut: ['demandé', 'en-instruction'],
    }),
  },
  {
    key: 'projetEnAttente',
    titre: 'Projets sans garanties financières',
    ariaLabel: 'Voir les projets sans garanties financières',
    href: Routes.GarantiesFinancières.enAttente.lister({ statut: 'actif' }),
    nEstPasÀInstruire: true,
  },
];
