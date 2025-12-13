import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Éliminé } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';

import { AccorderRecours } from './accorder/AccorderRecours.form';
import { RejeterRecours } from './rejeter/RejeterRecours.form';
import { AnnulerRecours } from './annuler/AnnulerRecours.form';
import { PasserRecoursEnInstruction } from './passerEnInstruction/PasserRecoursEnInstruction.form';

export type AvailableRecoursAction =
  | 'accorder'
  | 'rejeter'
  | 'annuler'
  | 'passer-en-instruction'
  | 'reprendre-instruction';

export type DétailsRecoursPageProps = {
  identifiantProjet: string;
  recours: PlainType<Éliminé.Recours.ConsulterDemandeRecoursReadModel>;
  historique: Array<TimelineItemProps>;
  actions: ReadonlyArray<AvailableRecoursAction>;
};

export const DétailsRecoursPage: FC<DétailsRecoursPageProps> = ({
  identifiantProjet,
  recours,
  historique,
  actions,
}) => (
  <ColumnPageTemplate
    heading={<Heading1>Demande de recours</Heading1>}
    leftColumn={{
      children: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Heading2>Détails</Heading2>
            <StatutDemandeBadge statut={recours.statut.value} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs italic">
              Demandé le{' '}
              <FormattedDate
                className="font-semibold"
                date={DateTime.bind(recours.demande.demandéLe).formatter()}
              />
              <DisplayAuteur email={Email.bind(recours.demande.demandéPar)} />
            </div>
            <div className="flex gap-2">
              <div className="whitespace-nowrap">Explications :</div>
              <blockquote className="font-semibold italic">"{recours.demande.raison}"</blockquote>
            </div>
          </div>
          <div className="mb-4">
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
            identifiantProjet,
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<AvailableRecoursAction>;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {(actions.includes('passer-en-instruction') || actions.includes('reprendre-instruction')) && (
      <PasserRecoursEnInstruction
        identifiantProjet={identifiantProjet}
        estUneReprise={actions.includes('reprendre-instruction')}
      />
    )}
    {actions.includes('accorder') && <AccorderRecours identifiantProjet={identifiantProjet} />}
    {actions.includes('rejeter') && <RejeterRecours identifiantProjet={identifiantProjet} />}
    {actions.includes('annuler') && <AnnulerRecours identifiantProjet={identifiantProjet} />}
  </ActionsList>
);
