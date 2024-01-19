'use client';

import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { StatutBadge, StatutBadgeProps } from '@/components/molecules/StatutBadge';
import { DetailsAboutProjetPageTemplate } from '@/components/templates/DetailsAboutProjetPageTemplate';
import { ProjetPageTemplateProps } from '@/components/templates/ProjetPageTemplate';

import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { EtapesAbandon, EtapesAbandonProps } from './EtapesAbandon';
import { StatutPreuveRecandidatureBadge } from './PreuveRecandidatureStatutBadge';
import { RejeterAbandon } from './rejeter/RejeterAbandon';

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
  actions: AvailableActions;
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  abandon,
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
          {abandon.demande.recandidature && (
            <>
              <Badge noIcon severity="info">
                avec recandidature
              </Badge>
              <StatutPreuveRecandidatureBadge statut={abandon.demande.preuveRecandidatureStatut} />
            </>
          )}
        </div>
      }
      details={<EtapesAbandon {...abandon} />}
      actions={mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
      })}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => {
  return actions.length ? (
    <>
      {actions.includes('demander-confirmation') && (
        <DemanderConfirmationAbandon identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder-avec-recandidature') && (
        <AccorderAbandonAvecRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('accorder-sans-recandidature') && (
        <AccorderAbandonSansRecandidature identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && <RejeterAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('confirmer') && <ConfirmerAbandon identifiantProjet={identifiantProjet} />}
      {actions.includes('annuler') && <AnnulerAbandon identifiantProjet={identifiantProjet} />}
    </>
  ) : null;
};
