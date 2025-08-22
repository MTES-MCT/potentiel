import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Timeline, type TimelineItemProps } from '@/components/organisms/Timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { AccorderChangementActionnaire } from './accorder/AccorderChangementActionnaire.form';
import { AnnulerChangementActionnaire } from './annuler/AnnulerChangementActionnaire.form';
import { DétailsChangementActionnaire } from './DétailsChangementActionnaire';
import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';
import { RejeterChangementActionnaire } from './rejeter/RejeterChangementActionnaire.form';

export type ChangementActionnaireActions = 'accorder' | 'rejeter' | 'annuler' | 'demander';

export type DétailsActionnairePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>;
  actions: Array<ChangementActionnaireActions>;
  historique: Array<TimelineItemProps>;
  demandeEnCoursDate?: string;
};

export const DétailsActionnairePage: FC<DétailsActionnairePageProps> = ({
  demande,
  identifiantProjet,
  actions,
  historique,
  demandeEnCoursDate,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    leftColumn={{
      children: (
        <div className="flex flex-col gap-8">
          {demandeEnCoursDate && demandeEnCoursDate !== demande.demandéeLe.date && (
            <InfoBoxDemandeEnCours
              identifiantProjet={identifiantProjet}
              demandeEnCoursDate={demandeEnCoursDate}
            />
          )}
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
          {mapToActionComponents({
            actions,
            identifiantProjet: IdentifiantProjet.bind(identifiantProjet).formatter(),
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<ChangementActionnaireActions>;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('accorder') && (
      <AccorderChangementActionnaire identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('rejeter') && (
      <RejeterChangementActionnaire identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('annuler') && (
      <AnnulerChangementActionnaire identifiantProjet={identifiantProjet} />
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
  </ActionsList>
);
