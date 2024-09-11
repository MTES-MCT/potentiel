import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Recours } from '@potentiel-domain/elimine';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email } from '@potentiel-domain/common';

import { StatutAbandonBadge } from '@/components/pages/abandon/StatutAbandonBadge';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { EtapesRecours } from './EtapesRecours';
import { AccorderRecours } from './accorder/AccorderRecours.form';
import { RejeterRecours } from './rejeter/RejeterRecours.form';
import { AnnulerRecours } from './annuler/AnnulerRecours.form';

export type AvailableRecoursAction = 'accorder' | 'rejeter' | 'annuler';

export type DétailsRecoursPageProps = {
  identifiantProjet: string;
  recours: PlainType<Recours.ConsulterRecoursReadModel>;
  role: PlainType<Role.ValueType>;
  actions: ReadonlyArray<AvailableRecoursAction>;
};

export const DétailsRecoursPage: FC<DétailsRecoursPageProps> = ({
  identifiantProjet,
  role,
  recours,
  actions,
}) => {
  const demandéLe = DateTime.bind(recours.demande.demandéLe).formatter();
  const demandéPar = Email.bind(recours.demande.demandéPar).formatter();
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Détail de la demande de recours</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <div>
              <Heading2 className="mb-4">Contexte</Heading2>
              <div className="flex flex-col gap-2">
                <div>
                  Statut : <StatutAbandonBadge statut={recours.statut.value} />
                </div>
                <div>
                  Demandé par : <span className="font-semibold">{demandéPar}</span>
                </div>
                <div>
                  Demandé le : {<FormattedDate className="font-semibold" date={demandéLe} />}
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
              <EtapesRecours recours={recours} role={role} />
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
