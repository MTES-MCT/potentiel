import Badge from '@codegouvfr/react-dsfr/Badge';
import Card from '@codegouvfr/react-dsfr/Card';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Contract from '@codegouvfr/react-dsfr/picto/Contract';
import Environment from '@codegouvfr/react-dsfr/picto/Environment';
import Notification from '@codegouvfr/react-dsfr/picto/Notification';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import Sun from '@codegouvfr/react-dsfr/picto/Sun';
import Tile from '@codegouvfr/react-dsfr/Tile';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Heading1, Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
export type HomePageProps = {
  utilisateur?: PotentielUtilisateur;
};

// Alerte sur la nouvelle
export function HomePageDreal({ utilisateur }: HomePageProps) {
  return (
    <PageTemplate banner={<Heading1>Page d'accueil</Heading1>}>
      <div className="flex flex-col gap-6">
        <Notice
          title="Votre page d'accueil fait peau neuve"
          severity="info"
          description="Retrouvez y les actualités de Potentiel, un résumé de suivi de vos projets et vos prochaines actions. N'hésitez pas à nous contacter pour nous partager vos retours !"
        />
        <Nouveautés />
        <Demandes />
        <SuiviProjets />
      </div>
    </PageTemplate>
  );
}

const Nouveautés = () => (
  <div>
    <div className="flex flex-row gap-4 mb-4">
      <Notification color="green-emeraude" fontSize="large" />
      <Heading2>Nouveautés</Heading2>
    </div>
    <div className="flex gap-2">
      <Card
        background
        border
        desc="Retrouvez les 102 candidats lauréats de votre région (Occitanie)"
        size="small"
        linkProps={{
          href: '#',
        }}
        title="L'appel d'offre PPE2 - Sol, période 9, a été notifiée le 11 septembre 2026"
        titleAs="h3"
      />
      <Card
        background
        border
        desc="Retrouvez les enrichis de nouvelles données dans l'onglet Export"
        enlargeLink
        linkProps={{
          href: '#',
        }}
        size="medium"
        title="Les exports de données ont été mis à jour sur Potentiel"
        titleAs="h3"
      />
    </div>
  </div>
);

const Demandes = () => (
  <div>
    <div className="flex flex-row gap-4 mb-4">
      <Contract color="yellow-moutarde" fontSize="large" />
      <Heading2>Demandes à traiter</Heading2>
    </div>
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
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

const SuiviProjets = () => (
  <div>
    <div className="flex flex-row gap-4 mb-4">
      <Environment color="green-emeraude" fontSize="large" />
      <Heading2>Mes projets</Heading2>
    </div>
    <div className="flex gap-2">
      <Tile
        enlargeLinkOrButton
        linkProps={{
          href: '#',
        }}
        orientation="horizontal"
        title="Projets mis en service"
        desc="3 nouvelles mis en service"
        titleAs="h3"
        pictogram={<Success color="green-emeraude" />}
      />
      <Tile
        enlargeLinkOrButton
        linkProps={{
          href: '#',
        }}
        orientation="horizontal"
        title="Répartition des projets"
        desc="83 projets éoliens, 109 projets photo voltaïques dans votre région"
        titleAs="h3"
        pictogram={<Sun color="green-emeraude" />}
      />
      {/* carte */}
    </div>
  </div>
);
