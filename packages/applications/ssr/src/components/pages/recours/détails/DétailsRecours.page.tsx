import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Recours } from '@potentiel-domain/elimine';
import { DateTime, Email } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { HistoriqueTimeline } from '@/components/molecules/historique/HistoriqueTimeline';

import { StatutRecoursBadge } from '../StatutRecoursBadge';

import { AccorderRecours } from './accorder/AccorderRecours.form';
import { RejeterRecours } from './rejeter/RejeterRecours.form';
import { AnnulerRecours } from './annuler/AnnulerRecours.form';

export type AvailableRecoursAction = 'accorder' | 'rejeter' | 'annuler';

export type DétailsRecoursPageProps = {
  identifiantProjet: string;
  recours: PlainType<Recours.ConsulterRecoursReadModel>;
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
  actions: ReadonlyArray<AvailableRecoursAction>;
};

export const DétailsRecoursPage: FC<DétailsRecoursPageProps> = ({
  identifiantProjet,
  recours,
  historique,
  actions,
}) => {
  const demandéLe = DateTime.bind(recours.demande.demandéLe).formatter();
  const demandéPar = Email.bind(recours.demande.demandéPar).formatter();
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Détail du recours</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <div>
              <Heading2 className="mb-4">Contexte</Heading2>
              <div className="flex flex-col gap-2">
                <div className="text-xs italic">
                  Demandé le <FormattedDate className="font-semibold" date={demandéLe} /> par{' '}
                  <span className="font-semibold">{demandéPar}</span>
                </div>
                <div>
                  Statut : <StatutRecoursBadge statut={recours.statut.value} />
                </div>
                <div className="flex gap-2">
                  <div className="whitespace-nowrap">Explications :</div>
                  <blockquote className="font-semibold italic">
                    "{recours.demande.raison}"
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="mb-4">
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
              identifiantProjet,
            })}
          </>
        ),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<AvailableRecoursAction>;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('accorder') && <AccorderRecours identifiantProjet={identifiantProjet} />}
      {actions.includes('rejeter') && <RejeterRecours identifiantProjet={identifiantProjet} />}
      {actions.includes('annuler') && <AnnulerRecours identifiantProjet={identifiantProjet} />}
    </div>
  ) : null;
