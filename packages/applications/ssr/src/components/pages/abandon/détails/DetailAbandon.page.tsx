'use client';

import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { StatutBadge, StatutBadgeProps } from '@/components/molecules/StatutBadge';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1 } from '@/components/atoms/headings';

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
  projet: ProjetBannerProps;
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
    <ColumnPageTemplate
      banner={<ProjetBanner {...projet} />}
      heading={
        <>
          <Heading1>Détail de l'abandon</Heading1>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <StatutBadge statut={statut} />
            {abandon.demande.recandidature && (
              <>
                <Badge noIcon severity="info">
                  avec recandidature
                </Badge>
                <StatutPreuveRecandidatureBadge
                  statut={abandon.demande.preuveRecandidatureStatut}
                />
              </>
            )}
          </div>
        </>
      }
      leftColumn={{
        className: 'flex-col gap-6',
        children: <EtapesAbandon {...abandon} />,
      }}
      rightColumn={{
        className: 'flex flex-col w-full md:w-1/4 gap-4',
        children: mapToActionComponents({
          actions,
          identifiantProjet: projet.identifiantProjet,
        }),
      }}
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
