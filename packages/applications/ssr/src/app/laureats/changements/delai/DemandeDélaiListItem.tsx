import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { getMotifDemandeDélaiLabel } from '../../[identifiant]/delai/_helpers/getMotifDemandeDélaiLabel';

export type DemandeDélaiListItemProps = PlainType<
  Lauréat.Délai.ListerDemandeDélaiReadModel['items'][number]
>;

export const DemandeDélaiListItem: FC<DemandeDélaiListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut: { statut },
  miseÀJourLe,
  demandéLe,
  nombreDeMois,
  autoritéCompétente,
  motif,
}) => (
  <ListItem
    miseÀJourLe={DateTime.bind(miseÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Demande de délai du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Délai.détail({
            identifiantProjet: IdentifiantProjet.bind(identifiantProjet).formatter(),
            date: DateTime.bind(demandéLe).formatter(),
            motif: motif.motif,
          }),
        }}
        aria-label={`voir le détail de la demande de délai pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
      <li>
        <span>
          Motif : <span className="font-semibold">{getMotifDemandeDélaiLabel(motif.motif)}</span>
        </span>
      </li>
      <li>
        <span>
          Délai demandé : <span className="font-semibold">{nombreDeMois} mois</span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande :{' '}
          <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} />
        </span>
      </li>
      {autoritéCompétente && (
        <li>
          <span>
            Autorité compétente pour l'instruction :{' '}
            <span className="font-semibold">
              {autoritéCompétente.autoritéCompétente.toLocaleUpperCase()}
            </span>
          </span>
        </li>
      )}
    </ul>
    <StatutDemandeBadge statut={statut} small />
  </ListItem>
);
