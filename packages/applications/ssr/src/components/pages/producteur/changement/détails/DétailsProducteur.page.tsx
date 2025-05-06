import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Producteur } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import {
  HistoriqueProducteurTimeline,
  HistoriqueProducteurTimelineProps,
} from '@/components/pages/producteur/changement/détails/timeline';

import { DétailsChangementProducteur } from './DétailsChangementProducteur';

export type ChangementProducteurActions = 'enregistrer-changement';

export type DétailsProducteurPageProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  changement: PlainType<Producteur.ConsulterChangementProducteurReadModel['changement']>;
  actions: Array<ChangementProducteurActions>;
  historique: HistoriqueProducteurTimelineProps['historique'];
};

export const DétailsProducteurPage: FC<DétailsProducteurPageProps> = ({
  identifiantProjet,
  changement,
  actions,
  historique,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    leftColumn={{
      children: (
        <div className="flex flex-col gap-8">
          <DétailsChangementProducteur changement={changement} />
          <div className="mb-4">
            <Heading2>Historique</Heading2>
            <HistoriqueProducteurTimeline historique={historique} />
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
  actions: ReadonlyArray<ChangementProducteurActions>;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>
      {actions.includes('enregistrer-changement') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Producteur.changement.enregistrer(identifiantProjet),
          }}
        >
          Faire un nouveau changement
        </Button>
      )}
    </div>
  ) : null;
