import Badge from '@codegouvfr/react-dsfr/Badge';
import Contract from '@codegouvfr/react-dsfr/picto/Contract';
import Tile from '@codegouvfr/react-dsfr/Tile';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { Heading2 } from '@/components/atoms/headings';

type DétailsDemandes = { total: number; new: number };
export type DemandesProps = {
  demandes: Record<AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction, DétailsDemandes>;
};

export const DemandesDétails = ({ demandes }: DemandesProps) => {
  console.log(demandes);
  return (
    <div>
      <div className="flex flex-row gap-4 mb-4">
        <Contract color="yellow-moutarde" fontSize="large" />
        <Heading2>Demandes à traiter</Heading2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {Object.entries(demandes).map(([domaine, détails]) => (
            <DemandesParDomaine
              key={domaine}
              domaine={domaine as AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction}
              total={détails.total}
              new={détails.new}
            />
          ))}
          <Tile
            enlargeLinkOrButton
            linkProps={{
              href: '#',
            }}
            orientation="horizontal"
            start={
              <Badge noIcon severity="info">
                New
              </Badge>
            }
            title="Actionnaires"
            desc="3 nouvelles demandes"
            titleAs="h3"
          />
          <Tile
            enlargeLinkOrButton
            linkProps={{
              href: '#',
            }}
            orientation="horizontal"
            start={
              <Badge noIcon severity="info">
                New
              </Badge>
            }
            title="Abandon"
            desc="1 nouvelle demande"
            titleAs="h3"
          />
        </div>
        <div className="flex flex-row gap-2">
          <Tile
            enlargeLinkOrButton
            linkProps={{
              href: '',
            }}
            orientation="horizontal"
            title="Puissance"
            desc="12 demandes à traiter"
            titleAs="h3"
          />
          <Tile
            orientation="horizontal"
            title="Représentant légal"
            desc="Pas de demande à traiter"
            titleAs="h3"
          />
        </div>
      </div>
    </div>
  );
};

const DemandesParDomaine = ({
  total,
  new: newCount,
  domaine,
}: DétailsDemandes & { domaine: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction }) => {
  return (
    <Tile
      enlargeLinkOrButton
      linkProps={{
        href: '#',
      }}
      orientation="horizontal"
      start={
        newCount > 0 && (
          <Badge noIcon severity="info">
            {newCount} nouvelles demandes
          </Badge>
        )
      }
      title={domaine}
      desc={total ? `${total} demandes à traiter` : 'Aucune demande à traiter'}
      titleAs="h3"
    />
  );
};
