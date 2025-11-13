import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

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
    miseÀJourLe={DateTime.bind(enregistréLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de fournisseur du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Fournisseur.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            enregistréLe.date,
          ),
        }}
        aria-label={`voir le détail du changement de fournisseur pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
      {évaluationCarboneSimplifiée !== undefined && (
        <li>
          <span>Évaluation carbone simplifiée : </span>
          <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
        </li>
      )}
    </ul>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
