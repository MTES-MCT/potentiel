import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Raccordement } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type DossierRaccordementListItemProps = PlainType<
  Raccordement.ListerDossierRaccordementReadModel['items'][number]
> & {
  gestionnaireRéseau: string;
};

export const DossierRaccordementListItem: FC<DossierRaccordementListItemProps> = ({
  identifiantProjet,
  nomProjet,
  codePostal,
  commune,
  département,
  région,
  référenceDossier,
  statutDGEC,
  dateMiseEnService,
  gestionnaireRéseau,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Projet lauréat"
        statut={statutDGEC}
      />
    }
    actions={<></>}
  >
    <div className="mt-4">
      <Icon id="fr-icon-map-pin-2-line" title="Commune du site de production" size="sm" />{' '}
      <span className="italic">
        {codePostal} {commune}, {département}, {région}
      </span>
    </div>
    <div className="mt-4">
      {gestionnaireRéseau && (
        <div>
          <Icon id="fr-icon-building-line" title="Gestionnaire Réseau" size="sm" /> Gestionnaire
          Réseau : <span className="font-bold">{gestionnaireRéseau}</span>
        </div>
      )}
      <div>
        <Icon id="ri-price-tag-3-line" title="Date de mise en service" size="sm" /> Référence du
        dossier : <span className="font-bold">{référenceDossier.référence}</span>
      </div>
      <div>
        <Icon id="fr-icon-calendar-line" title="Date de mise en service" size="sm" /> Date de mise
        en service :{' '}
        {dateMiseEnService ? (
          <FormattedDate
            className="font-bold"
            date={DateTime.bind(dateMiseEnService).formatter()}
          />
        ) : (
          <Badge noIcon small className="mx-1" severity="info">
            Non transmise
          </Badge>
        )}
      </div>
    </div>
  </ListItem>
);
