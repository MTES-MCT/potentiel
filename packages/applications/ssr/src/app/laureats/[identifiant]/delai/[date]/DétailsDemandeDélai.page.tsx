import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { InfoBoxDemandeDélai } from '../InfoBoxDemandeDélai';

import { AnnulerDemandeDélai } from './annuler/AnnulerDemandeDélai';
import { PasserEnInstructionDemandeDélai } from './passer-en-instruction/PasserEnInstructionDemandeDélai';
import { RejeterDemandeDélai } from './rejeter/RejeterDemandeDélai';
import { AccorderDemandeDélai } from './accorder/AccorderDemandeDélai';
import { DétailsDemandeDélai } from './DétailsDemandeDélai';

export type DemandeDélaiActions =
  | 'annuler'
  | 'passer-en-instruction'
  | 'reprendre-instruction'
  | 'accorder'
  | 'rejeter'
  | 'corriger';

export type DétailsDemandeDélaiPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Délai.ConsulterDemandeDélaiReadModel>;
  dateAchèvementPrévisionnelActuelle: PlainType<
    Lauréat.Achèvement.ConsulterAchèvementReadModel['dateAchèvementPrévisionnel']
  >;
  actions: Array<DemandeDélaiActions>;
  historique: Array<TimelineItemProps>;
};

export const DétailsDemandeDélaiPage: FC<DétailsDemandeDélaiPageProps> = ({
  identifiantProjet,
  demande,
  dateAchèvementPrévisionnelActuelle,
  actions,
  historique,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.bind(identifiantProjet);
  return (
    <ColumnPageTemplate
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <DétailsDemandeDélai demande={demande} />
            <div>
              <Heading2>Historique</Heading2>
              <Timeline items={historique} />
            </div>
          </div>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col gap-8',
        children: (
          <>
            {mapToActionComponents({
              actions,
              identifiantProjet: identifiantProjetValueType,
              dateDemande: DateTime.bind(demande.demandéLe),
              nombreDeMois: demande.nombreDeMois,
              dateAchèvementPrévisionnelActuelle:
                Lauréat.Achèvement.DateAchèvementPrévisionnel.bind(
                  dateAchèvementPrévisionnelActuelle,
                ),
            })}
            <InfoBoxDemandeDélai />
          </>
        ),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: Array<DemandeDélaiActions>;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDemande: DateTime.ValueType;
  nombreDeMois: number;
  dateAchèvementPrévisionnelActuelle: Lauréat.Achèvement.DateAchèvementPrévisionnel.ValueType;
};

const mapToActionComponents = ({
  identifiantProjet,
  dateDemande,
  actions,
  nombreDeMois,
  dateAchèvementPrévisionnelActuelle,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {(actions.includes('passer-en-instruction') || actions.includes('reprendre-instruction')) && (
      <PasserEnInstructionDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
        estUneReprise={actions.includes('reprendre-instruction')}
      />
    )}
    {actions.includes('accorder') && (
      <AccorderDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
        nombreDeMois={nombreDeMois}
        dateAchèvementPrévisionnelActuelle={mapToPlainObject(dateAchèvementPrévisionnelActuelle)}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterDemandeDélai
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={dateDemande.formatter()}
      />
    )}

    {actions.includes('corriger') && (
      <Button
        linkProps={{
          href: Routes.Délai.corriger(identifiantProjet.formatter(), dateDemande.formatter()),
        }}
        className="block w-1/2 text-center"
      >
        Corriger
      </Button>
    )}
    {actions.includes('annuler') && (
      <AnnulerDemandeDélai identifiantProjet={identifiantProjet.formatter()} />
    )}
  </ActionsList>
);
