import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { AccorderChangementActionnaire } from './accorder/AccorderChangementActionnaire.form';
import { RejeterChangementActionnaire } from './rejeter/RejeterChangementActionnaire.form';
import { AnnulerChangementActionnaire } from './annuler/AnnulerChangementActionnaire.form';
import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';
import { DétailsChangementActionnaire } from './DétailsChangementActionnaire';

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
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
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
            dateDemande: demande.demandéeLe.date,
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<ChangementActionnaireActions>;
  identifiantProjet: string;
  dateDemande: DétailsActionnairePageProps['demande']['demandéeLe']['date'];
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  dateDemande,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('accorder') && (
      <AccorderChangementActionnaire
        identifiantProjet={identifiantProjet}
        dateDemande={dateDemande}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterChangementActionnaire
        identifiantProjet={identifiantProjet}
        dateDemande={dateDemande}
      />
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
      <AnnulerChangementActionnaire identifiantProjet={identifiantProjet} />
    )}
  </ActionsList>
);
