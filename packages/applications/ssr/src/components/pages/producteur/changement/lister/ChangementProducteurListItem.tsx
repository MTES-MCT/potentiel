import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { DateTime } from '@potentiel-domain/common';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { ChangementProducteurListPageProps } from './ChangementProducteurList.page';

export type ChangementProducteurListItemProps =
  ChangementProducteurListPageProps['list']['items'][number];

export const ChangementProducteurListItem: FC<ChangementProducteurListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
  ancienProducteur,
  nouveauProducteur,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de producteur du projet"
        misÀJourLe={DateTime.bind(enregistréLe).formatter()}
      />
    }
    actions={[]}
  >
    <ul className="mt-3 text-sm">
      <li>
        <span>
          Ancien producteur : <span>{ancienProducteur}</span>
        </span>
      </li>
      <li>
        <span>
          Nouveau producteur : <span className="font-semibold">{nouveauProducteur}</span>
        </span>
      </li>
    </ul>
    <Badge noIcon severity="success" small>
      information enregistrée
    </Badge>
  </ListItem>
);
