import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Éliminé } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '../../components/organisms/demande/StatutDemandeBadge';

export type RecoursListItemProps = PlainType<
  Éliminé.Recours.ListerDemandeRecoursReadModel['items'][number]
>;

export const RecoursListItem: FC<RecoursListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  miseÀJourLe,
  demandéLe,
  autoritéCompétente,
}) => {
  return (
    <ListItem
      miseÀJourLe={DateTime.bind(miseÀJourLe).formatter()}
      heading={
        <ProjectListItemHeading
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          prefix="Recours du projet"
        />
      }
      actions={
        <Button
          linkProps={{
            href: Routes.Recours.détail(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
              demandéLe.date,
            ),
          }}
          aria-label={`voir le détail du recours pour le projet ${nomProjet}`}
        >
          Consulter
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          Autorité compétente pour l'instruction :{' '}
          <span className="font-semibold">
            {autoritéCompétente.autoritéCompétente.toLocaleUpperCase()}
          </span>
        </div>
        <StatutDemandeBadge statut={statut.statut} small />
      </div>
    </ListItem>
  );
};
