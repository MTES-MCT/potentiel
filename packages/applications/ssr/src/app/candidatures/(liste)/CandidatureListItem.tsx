import { FC } from 'react';

import { Candidature } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';

import { getCandidatureListActions } from '../_helpers';

import { CandidatureListItemActions } from './CandidatureListItemActions';

export type CandidatureListItemProps = PlainType<
  Candidature.ListerCandidaturesReadModel['items'][number]
>;

export const CandidatureListItem: FC<CandidatureListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  nomCandidat,
  emailContact,
  nomReprésentantLégal,
  puissanceProductionAnnuelle,
  unitéPuissance,
  prixReference,
  evaluationCarboneSimplifiée,
  typeActionnariat,
  attestation,
  estNotifiée,
  statut,
}) => (
  <ProjectListItem
    identifiantProjet={identifiantProjet}
    nomProjet={nomProjet}
    localité={localité}
    producteur={nomCandidat}
    email={emailContact}
    nomReprésentantLégal={nomReprésentantLégal}
    puissance={{
      valeur: puissanceProductionAnnuelle,
      unité: unitéPuissance,
    }}
    prixReference={prixReference}
    evaluationCarboneSimplifiée={evaluationCarboneSimplifiée}
    typeActionnariat={typeActionnariat}
    actions={
      <CandidatureListItemActions
        identifiantProjet={identifiantProjet}
        nomProjet={nomProjet}
        actions={getCandidatureListActions({
          aUneAttestation: !!attestation,
          estNotifiée,
        })}
      />
    }
    statutBadge={
      <>
        <StatutCandidatureBadge statut={Candidature.StatutCandidature.bind(statut).formatter()} />
        {estNotifiée !== undefined && <NotificationBadge estNotifié={estNotifiée} />}
      </>
    }
  />
);
