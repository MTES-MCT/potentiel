import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import { StatutLauréatBadge } from '@/components/molecules/projet/lauréat/StatutLauréatBadge';

export type LauréatListItemProps = PlainType<Lauréat.ListerLauréatReadModel['items'][number]>;

export const LauréatListItem: FC<LauréatListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  nomReprésentantLégal,
  prixReference,
  evaluationCarboneSimplifiée,
  typeActionnariat,
  statut,
  producteur,
  email,
  puissance: { valeur, unité },
}) => (
  <ProjectListItem
    identifiantProjet={identifiantProjet}
    nomProjet={nomProjet}
    localité={localité}
    producteur={producteur}
    email={email}
    nomReprésentantLégal={nomReprésentantLégal}
    puissance={{
      valeur,
      unité,
    }}
    prixReference={prixReference}
    evaluationCarboneSimplifiée={evaluationCarboneSimplifiée}
    typeActionnariat={typeActionnariat}
    statutBadge={<StatutLauréatBadge statut={Lauréat.StatutLauréat.bind(statut).formatter()} />}
    actions={
      <Button
        className="md:flex ml-auto"
        linkProps={{
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        }}
        aria-label={`Lien vers la page du projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  />
);
