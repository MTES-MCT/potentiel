import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import { StatutÉliminéBadge } from '@/components/molecules/projet/éliminé/StatutÉliminéBadge';

export type ÉliminéListItemProps = PlainType<Éliminé.ListerÉliminéReadModel['items'][number]>;

export const ÉliminéListItem: FC<ÉliminéListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  nomReprésentantLégal,
  prixReference,
  evaluationCarboneSimplifiée,
  typeActionnariat,
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
    statutBadge={<StatutÉliminéBadge />}
    actions={
      <Button
        className="md:flex ml-auto"
        linkProps={{
          href: Routes.Éliminé.détails.tableauDeBord(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
          ),
        }}
        aria-label={`Lien vers la page du projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  />
);
