'use client';

import { FC } from 'react';
import { StatutBadge, StatutBadgeProps } from '@/components/molecules/StatutBadge';
import { ProjetPageTemplateProps } from '@/components/templates/ProjetPageTemplate';
import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { DetailsAboutProjetPageTemplate } from '@/components/templates/DetailsAboutProjetPageTemplate';
import { EtapesAbandonProps, EtapesAbandon } from './EtapesAbandon';

type AvailableActions = Array<
  | 'demander-confirmation'
  | 'confirmer'
  | 'annuler'
  | 'accorder-avec-recandidature'
  | 'accorder-sans-recandidature'
  | 'rejeter'
>;

export type DetailAbandonPageProps = {
  projet: ProjetPageTemplateProps['projet'];
  abandon: EtapesAbandonProps;
  statut: StatutBadgeProps['statut'];
  identifiantUtilisateur: string;
  actions: AvailableActions;
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  abandon,
  statut,
  identifiantUtilisateur,
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
      details={<EtapesAbandon {...{ ...abandon, statut }} />}
      actions={mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
        identifiantUtilisateur,
      })}
    />
  );
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  identifiantUtilisateur,
}: {
  actions: AvailableActions;
  identifiantProjet: string;
  identifiantUtilisateur: string;
}) => {
  return actions.length ? (
    <>
      {actions.includes('demander-confirmation') && (
        <DemanderConfirmationAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('rejeter') && (
        <RejeterAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('accorder-avec-recandidature') && (
        <AccorderAbandonAvecRecandidature
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('accorder-sans-recandidature') && (
        <AccorderAbandonSansRecandidature
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('confirmer') && (
        <ConfirmerAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('annuler') && (
        <AnnulerAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
    </>
  ) : null;
};
