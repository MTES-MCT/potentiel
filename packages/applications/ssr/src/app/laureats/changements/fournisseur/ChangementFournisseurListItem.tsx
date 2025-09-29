import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutChangementFournisseurBadge } from '../../[identifiant]/fournisseur/StatutChangementFournisseurBadge';

export type ChangementFournisseurListItemProps = PlainType<
  Lauréat.Fournisseur.ListerChangementFournisseurReadModel['items'][number]
>;

export const ChangementFournisseurListItem: FC<ChangementFournisseurListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
  évaluationCarboneSimplifiée,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de fournisseur du projet"
        misÀJourLe={DateTime.bind(enregistréLe).formatter()}
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Fournisseur.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            enregistréLe.date,
          ),
          prefetch: false,
        }}
        aria-label="voir le détail du changement"
      >
        Voir le changement
      </Button>
    }
  >
    <ul className="my-3 text-sm">
      {évaluationCarboneSimplifiée !== undefined && (
        <li>
          <span>Évaluation carbone simplifiée : </span>
          <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
        </li>
      )}
    </ul>
    <StatutChangementFournisseurBadge />
  </ListItem>
);
