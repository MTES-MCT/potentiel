import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type DossierRaccordementListItemProps = PlainType<
  Lauréat.Raccordement.ListerDossierRaccordementReadModel['items'][number]
>;

export const DossierRaccordementListItem: FC<DossierRaccordementListItemProps> = ({
  identifiantProjet,
  nomProjet,
  codePostal,
  commune,
  département,
  région,
  référenceDossier,
  dateMiseEnService,
  raisonSocialeGestionnaireRéseau,
  puissance,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Projet lauréat"
      />
    }
    actions={
      <div className="flex md:flex-col items-end gap-2">
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Raccordement.détail(IdentifiantProjet.bind(identifiantProjet).formatter()),
            prefetch: false,
          }}
          aria-label={`Consulter le dossier de raccordement ${référenceDossier}`}
        >
          Consulter
        </Button>
      </div>
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
        <Icon id="fr-icon-flashlight-line" title="Puissance" size="sm" /> Puissance :{' '}
        <span className="font-bold">{puissance}</span>
      </div>
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
