import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { Timeline, type TimelineItemProps } from '@/components/organisms/timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { AccorderChangementActionnaireForm } from './accorder/AccorderChangementActionnaire.form';
import { AnnulerChangementActionnaireForm } from './annuler/AnnulerChangementActionnaire.form';
import { DétailsChangementActionnaire } from './DétailsChangementActionnaire';
import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';
import { RejeterChangementActionnaireForm } from './rejeter/RejeterChangementActionnaire.form';

export type ChangementActionnaireActions = 'accorder' | 'rejeter' | 'annuler' | 'demander';

export type DétailsActionnairePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>;
  actions: Array<ChangementActionnaireActions>;
  historique: Array<TimelineItemProps>;
  dateDemandeEnCoursSiDifférente?: string;
};

export const DétailsActionnairePage: FC<DétailsActionnairePageProps> = ({
  demande,
  identifiantProjet,
  actions,
  historique,
  dateDemandeEnCoursSiDifférente,
}) => (
  <ColumnPageTemplate
    leftColumn={{
      children: (
        <div className="flex flex-col gap-8">
          <DétailsChangementActionnaire demande={demande} />
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
          {dateDemandeEnCoursSiDifférente && (
            <InfoBoxDemandeEnCours
              identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
              dateDemandeEnCours={dateDemandeEnCoursSiDifférente}
            />
          )}
          {mapToActionComponents({
            actions,
            identifiantProjet: IdentifiantProjet.bind(identifiantProjet).formatter(),
            dateDemandeEnCoursSiDifférente,
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<ChangementActionnaireActions>;
  identifiantProjet: string;
  dateDemandeEnCoursSiDifférente?: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('accorder') && (
      <AccorderChangementActionnaireForm identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('rejeter') && (
      <RejeterChangementActionnaireForm identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('demander') && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.Actionnaire.changement.demander(identifiantProjet),
        }}
      >
        Faire une nouvelle demande de changement
      </Button>
    )}
    {actions.includes('annuler') && (
      <AnnulerChangementActionnaireForm identifiantProjet={identifiantProjet} />
    )}
  </ActionsList>
);
