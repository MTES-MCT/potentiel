import { FC } from 'react';

import { Raccordement } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type DossierRaccordementListItemProps = PlainType<
  Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceReadModel['items'][number]
>;

export const DossierRaccordementListItem: FC<DossierRaccordementListItemProps> = ({
  identifiantProjet,
  nomProjet,
  codePostal,
  commune,
  référenceDossier,
  statutDGEC,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Dossier de raccordement du projet"
      />
    }
    actions={<></>}
  >
    <div>
      {référenceDossier.référence} - {codePostal} - {commune} - {statutDGEC}
    </div>
  </ListItem>
);
