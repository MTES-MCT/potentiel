import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Timeline, TimelineItemProps } from '@/components/organisms/timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';
import { AnnulerChangementPuissanceForm } from './annuler/AnnulerChangementPuissance.form';
import { DétailsChangementPuissance } from './DétailsChangementPuissance';

export type ChangementPuissanceActions = 'annuler' | 'demander' | 'accorder' | 'rejeter';

export type DétailsPuissancePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demande: PlainType<Lauréat.Puissance.ConsulterChangementPuissanceReadModel['demande']>;
  puissanceInitiale: number;
  unitéPuissance: string;
  actions: Array<ChangementPuissanceActions>;
  dateDemandeEnCours?: string;
  historique: Array<TimelineItemProps>;
};

export const DétailsPuissancePage: FC<DétailsPuissancePageProps> = ({
  identifiantProjet,
  demande,
  unitéPuissance,
  puissanceInitiale,
  actions,
  dateDemandeEnCours,
  historique,
}) => (
  <ColumnPageTemplate
    leftColumn={{
      children: (
        <div className="flex flex-col gap-8">
          {dateDemandeEnCours && dateDemandeEnCours !== demande.demandéeLe.date && (
            <InfoBoxDemandeEnCours
              identifiantProjet={identifiantProjet}
              dateDemandeEnCours={dateDemandeEnCours}
            />
          )}
          <DétailsChangementPuissance
            demande={demande}
            unitéPuissance={unitéPuissance}
            puissanceInitiale={puissanceInitiale}
          />
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
            identifiantProjet: IdentifiantProjet.bind(identifiantProjet).formatter(),
            estÀLaBaisse: demande.nouvellePuissance < puissanceInitiale,
          })}
        </>
      ),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<ChangementPuissanceActions>;
  identifiantProjet: string;
  estÀLaBaisse: boolean;
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  estÀLaBaisse,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('accorder') && (
      <AccorderChangementPuissance
        identifiantProjet={identifiantProjet}
        estÀLaBaisse={estÀLaBaisse}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterChangementPuissance
        identifiantProjet={identifiantProjet}
        estÀLaBaisse={estÀLaBaisse}
      />
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
    {actions.includes('annuler') && (
      <AnnulerChangementPuissanceForm identifiantProjet={identifiantProjet} />
    )}
  </ActionsList>
);
