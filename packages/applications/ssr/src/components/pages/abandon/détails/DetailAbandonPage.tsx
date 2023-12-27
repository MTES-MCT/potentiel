'use client';

import { FC } from 'react';
import {
  DetailDemandeAbandon,
  DetailDemandeAbandonProps,
} from '@/components/pages/abandon/détails/DetailDemandeAbandon';
import {
  DetailInstructionAbandon,
  DetailInstructionAbandonProps,
} from '@/components/pages/abandon/détails/DetailInstructionAbandon';
import { StatutBadge, StatutBadgeProps } from '@/components/molecules/StatutBadge';
import { ProjetPageTemplateProps } from '@/components/templates/ProjetPageTemplate';
import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { DetailsAboutProjetPageTemplate } from '@/components/templates/DetailsAboutProjetPageTemplate';

type AvailableActions = Array<
  | 'demander-confirmation'
  | 'confirmer'
  | 'annuler'
  | 'accorder-avec-recandidature'
  | 'accorder-sans-recandidature'
  | 'rejeter'
>;

export type DetailAbandonPageProps = {
  statut: StatutBadgeProps['statut'];
  projet: ProjetPageTemplateProps['projet'];
  demande: DetailDemandeAbandonProps;
  instruction: DetailInstructionAbandonProps;
  actions: AvailableActions;
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  demande,
  instruction,
  statut,
  actions,
}) => {
  return (
    <DetailsAboutProjetPageTemplate
      projet={projet}
      heading={
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <span>Abandon</span>
          <StatutBadge statut={statut} />
        </div>
      }
      details={
        <>
          <DetailDemandeAbandon {...{ ...demande, statut }} />
          {(instruction.accord || instruction.confirmation || instruction.rejet) && (
            <div className="mt-6">
              <DetailInstructionAbandon {...instruction} />
            </div>
          )}
        </>
      }
      actions={mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
      })}
    />
  );
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
}: {
  actions: AvailableActions;
  identifiantProjet: string;
}) => {
  return actions.length ? (
    <>
      {actions.includes('demander-confirmation') && (
        <DemanderConfirmationAbandon identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && <RejeterAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('accorder-avec-recandidature') && (
        <AccorderAbandonAvecRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder-sans-recandidature') && (
        <AccorderAbandonSansRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('confirmer') && <ConfirmerAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('annuler') && <AnnulerAbandon identifiantProjet={identifiantProjet} />}
    </>
  ) : null;
};
