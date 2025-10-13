import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { DétailsInformationEnregistrée } from '@/components/organisms/demande/DétailsInformationEnregistrée';

import { AccorderChangementActionnaire } from './accorder/AccorderChangementActionnaire.form';
import { RejeterChangementActionnaire } from './rejeter/RejeterChangementActionnaire.form';
import { AnnulerChangementActionnaire } from './annuler/AnnulerChangementActionnaire.form';
import { InfoBoxDemandeChangementActionnaireEnCours } from './(demande)/InfoBoxDemandeChangementActionnaireEnCours';
import { DétailsActionnaire } from './DétailsActionnaire';
import { DétailsDemandeChangementActionnaire } from './(demande)/DétailsDemandeChangementActionnaire';

export type ChangementActionnaireActions = 'accorder' | 'rejeter' | 'annuler' | 'demander';

export type DétailsChangementActionnairePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>;
  actions: Array<ChangementActionnaireActions>;
  historique: Array<TimelineItemProps>;
  demandeEnCoursDate?: string;
};

export const DétailsChangementActionnairePage: FC<DétailsChangementActionnairePageProps> = ({
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
            <InfoBoxDemandeChangementActionnaireEnCours
              identifiantProjet={identifiantProjet}
              demandeEnCoursDate={demandeEnCoursDate}
            />
          )}
          {demande.statut.statut === 'information-enregistrée' ? (
            <DétailsInformationEnregistrée
              title="Changement d'actionnaire(s)"
              détailsSpécifiques={
                <DétailsActionnaire nouvelActionnaire={demande.nouvelActionnaire} />
              }
              changement={{
                enregistréPar: demande.demandéePar,
                enregistréLe: demande.demandéeLe,
                raison: demande.raison,
                pièceJustificative: demande.pièceJustificative,
              }}
            />
          ) : (
            <DétailsDemandeChangementActionnaire demande={demande} />
          )}

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
  dateDemande: DétailsChangementActionnairePageProps['demande']['demandéeLe']['date'];
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
