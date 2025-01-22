import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Historique } from '@potentiel-domain/historique';

import { Heading1, Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { HistoriqueTimeline } from '../../../../molecules/historique/HistoriqueTimeline';

import { AccorderChangementActionnaire } from './accorder/AccorderChangementActionnaire.form';
import { RejeterChangementActionnaire } from './rejeter/RejeterChangementActionnaire.form';
import { AnnulerChangementActionnaire } from './annuler/AnnulerChangementActionnaire.form';
import { DétailsChangementActionnaire } from './DétailsChangementActionnaire';

type ChangementActionnaireActions = 'accorder' | 'rejeter' | 'annuler' | 'demander';

export type DétailsActionnairePageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  actionnaire?: PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['actionnaire']>;
  demande?: PlainType<Actionnaire.ConsulterChangementActionnaireReadModel['demande']>;
  actions: Array<ChangementActionnaireActions>;
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
};

export const DétailsActionnairePage: FC<DétailsActionnairePageProps> = ({
  actionnaire,
  demande,
  identifiantProjet,
  actions,
  historique,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    heading={<Heading1>Détails de l’actionnariat</Heading1>}
    leftColumn={{
      children: (
        <div className="flex flex-col gap-8">
          <DétailsChangementActionnaire actionnaire={actionnaire} demande={demande} />
          <div>
            <Heading2>Historique</Heading2>
            <HistoriqueTimeline historique={historique} />
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

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

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
    </div>
  ) : null;
