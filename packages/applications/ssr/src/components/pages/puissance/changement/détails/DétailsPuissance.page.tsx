import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Puissance } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  HistoriquePuissanceTimeline,
  HistoriquePuissanceTimelineProps,
} from '@/components/pages/puissance/changement/détails/timeline';

import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';
import { AnnulerChangementPuissance } from './annuler/AnnulerChangementPuissance.form';
import { DétailsChangementPuissance } from './DétailsChangementPuissance';
import { AccorderChangementPuissance } from './accorder/AccorderChangementPuissance.form';
import { RejeterChangementPuissance } from './rejeter/RejeterChangementPuissance.form';

export type ChangementPuissanceActions = 'annuler' | 'demander' | 'accorder' | 'rejeter';

export type DétailsPuissancePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Puissance.ConsulterChangementPuissanceReadModel['demande']>;
  puissanceInitiale: number;
  unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
  actions: Array<ChangementPuissanceActions>;
  demandeEnCoursDate?: string;
  historique: HistoriquePuissanceTimelineProps['historique'];
};

export const DétailsPuissancePage: FC<DétailsPuissancePageProps> = ({
  identifiantProjet,
  demande,
  unitéPuissance,
  puissanceInitiale,
  actions,
  demandeEnCoursDate,
  historique,
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
          <DétailsChangementPuissance
            demande={demande}
            unitéPuissance={unitéPuissance}
            puissanceInitiale={puissanceInitiale}
          />
          <div className="mb-4">
            <Heading2>Historique</Heading2>
            <HistoriquePuissanceTimeline historique={historique} unitéPuissance={unitéPuissance} />
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
  actions: ReadonlyArray<ChangementPuissanceActions>;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('annuler') && (
        <AnnulerChangementPuissance identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder') && (
        <AccorderChangementPuissance identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterChangementPuissance identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('demander') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Puissance.changement.demander(identifiantProjet),
          }}
        >
          Faire une nouvelle demande de changement
        </Button>
      )}
    </div>
  ) : null;
