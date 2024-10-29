import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Button from '@codegouvfr/react-dsfr/Button';

import { Raccordement } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import {
  DossierRaccordementListItemActions,
  DossierRaccordementListItemActionsProps,
} from './DossierRaccordementListItemActions';

export type DossierRaccordementListItemProps = PlainType<
  Raccordement.ListerDossierRaccordementReadModel['items'][number]
> & {
  actions: DossierRaccordementListItemActionsProps['actions'];
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
  raisonSocialeGestionnaireRéseau,
  actions,
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
    actions={
      <DossierRaccordementListItemActions
        identifiantProjet={identifiantProjet}
        référence={référenceDossier}
        actions={actions}
      />
    }
  >
    <div className="mt-4">
      <Icon id="fr-icon-map-pin-2-line" title="Commune du site de production" size="sm" />{' '}
      <span className="italic">
        {codePostal} {commune}, {département}, {région}
      </span>
    </div>
    <div className="mt-4">
      <div>
        <Icon id="fr-icon-building-line" title="Gestionnaire Réseau" size="sm" /> Gestionnaire
        Réseau : <span className="font-bold">{raisonSocialeGestionnaireRéseau}</span>
      </div>
      <div>
        <Icon id="ri-price-tag-3-line" title="Référence du dossier" size="sm" /> Référence du
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
