import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

export type ChangementReprésentantLégalListItemProps = PlainType<
  Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items'][number]
>;

export const ChangementReprésentantLégalListItem: FC<ChangementReprésentantLégalListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  miseÀJourLe,
  demandéLe,
  autoritéCompétente,
}) => (
  <ListItem
    miseÀJourLe={DateTime.bind(miseÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement du représentant légal du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.ReprésentantLégal.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandéLe.date,
          ),
        }}
        aria-label={`voir le détail de la demande de changement de représentant légal pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <div className="flex flex-col gap-2">
      {autoritéCompétente && (
        <div>
          <span>
            Autorité compétente pour l'instruction :{' '}
            <span className="font-semibold">
              {autoritéCompétente.autoritéCompétente.toLocaleUpperCase()}
            </span>
          </span>
        </div>
      )}
      <StatutDemandeBadge statut={statut.statut} small />
    </div>
  </ListItem>
);
