import { FC } from 'react';
import Link from 'next/link';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { Icon } from '@/components/atoms/Icon';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';

export type CandidatureListItemProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  statut: PlainType<StatutProjet.ValueType>;
  nomProjet: Candidature.ConsulterCandidatureReadModel['nomProjet'];
  nomCandidat: Candidature.ConsulterCandidatureReadModel['nomCandidat'];
  nomReprésentantLégal: Candidature.ConsulterCandidatureReadModel['nomReprésentantLégal'];
  emailContact: Candidature.ConsulterCandidatureReadModel['emailContact'];
  puissanceProductionAnnuelle: Candidature.ConsulterCandidatureReadModel['puissanceProductionAnnuelle'];
  prixReference: Candidature.ConsulterCandidatureReadModel['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['evaluationCarboneSimplifiée'];
  localité: {
    commune: Candidature.ConsulterCandidatureReadModel['localité']['commune'];
    département: Candidature.ConsulterCandidatureReadModel['localité']['département'];
    région: Candidature.ConsulterCandidatureReadModel['localité']['région'];
  };
  unitePuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
};

export const CandidatureListItem: FC<CandidatureListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  localité: { commune, département, région },
  nomCandidat,
  nomReprésentantLégal,
  emailContact,
  puissanceProductionAnnuelle,
  prixReference,
  unitePuissance,
  evaluationCarboneSimplifiée,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        identifiantProjet={identifiantProjet}
        nomProjet={nomProjet}
        prefix=""
      />
    }
    actions={
      <Link
        href={Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter())}
        className="self-center mt-4 md:self-end md:mt-0"
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Link>
    }
  >
    <div className="flex flex-col gap-2 md:gap-0 mt-2">
      <div className="flex gap-1 items-center" title="Localité du candidat">
        <Icon id="fr-icon-map-pin-2-line" size="xs" />
        <div className="text-sm">
          {commune}, {département}, {région}
        </div>
      </div>
      <div className="flex gap-1 items-center" title="Nom du candidat">
        <Icon id="fr-icon-community-line" size="xs" />
        <div className="text-sm">{nomCandidat}</div>
      </div>
      <div className="flex gap-1 items-center" title="Nom du représentant légal">
        <Icon id="fr-icon-user-line" size="xs" />
        <div className="text-sm">
          {nomReprésentantLégal} ({emailContact})
        </div>
      </div>
      <div className="flex gap-1 items-center" title="Puissance">
        <Icon id="fr-icon-lightbulb-line" size="xs" />
        <div className="text-sm">
          {puissanceProductionAnnuelle} {unitePuissance}
        </div>
      </div>
      <div className="flex gap-1 items-center" title="Prix de référence">
        <Icon id="fr-icon-money-euro-circle-line" size="xs" />
        <div className="text-sm">{prixReference} €/MWh</div>
      </div>
      <div className="flex gap-1 items-center" title="Évaluation carbone">
        <Icon id="fr-icon-cloudy-2-line" size="xs" />
        <div className="text-sm">
          {evaluationCarboneSimplifiée === 0
            ? '--'
            : `${evaluationCarboneSimplifiée} kg eq CO2/kWc`}
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-2 mt-3">
      <StatutProjetBadge statut={statut.statut} />
    </div>
  </ListItem>
);
