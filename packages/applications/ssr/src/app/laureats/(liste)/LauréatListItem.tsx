import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PPABadge } from '@/components/molecules/projet/lauréat/PPABadge';
import { StatutLauréatBadge } from '@/components/molecules/projet/lauréat/StatutLauréatBadge';
import { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';

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
  estPartiEnPPA,
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
    statutBadge={
      <div className="flex gap-1">
        <StatutLauréatBadge statut={Lauréat.StatutLauréat.bind(statut).formatter()} />
        {estPartiEnPPA && <PPABadge />}
      </div>
    }
    actions={
      <Button
        className="md:flex ml-auto"
        linkProps={{
          href: Routes.Lauréat.détails.tableauDeBord(
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
