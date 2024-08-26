import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Icon } from '@/components/atoms/Icon';
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
  <div className="flex flex-1 flex-col gap-6">
    <div className="flex items-center">
      <ProjectListItemHeading
        identifiantProjet={identifiantProjet}
        nomProjet={nomProjet}
        prefix="Candidature du projet"
        statut={statut.statut}
      />
      <Button
        className="hidden md:flex ml-auto"
        linkProps={{
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        }}
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Button>
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex md:flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <Icon id="fr-icon-map-pin-2-line" title="Localisation du projet" size="sm" />
          <span className="italic">
            {commune}, {département}, {région}
          </span>
        </div>

        <div className="flex  items-center gap-2">
          <Icon id="fr-icon-building-line" title="Nom du candidat" size="sm" />
          {nomCandidat}
        </div>
        <div className="flex items-center gap-2">
          <Icon id="fr-icon-user-line" title="Représentant légal" size="sm" />
          <div className="flex flex-col overflow-hidden">
            <div>{nomReprésentantLégal}</div>
            <div className="truncate" title={emailContact}>
              {emailContact}
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="fr-icon-flashlight-fill"
            className="text-dsfr-yellowTournesol-_850_200-default"
            title="Puissance"
          />
          <div className="lg:flex lg:flex-col items-center">
            {puissanceProductionAnnuelle}
            <span className="italic text-sm"> {unitePuissance}</span>
          </div>
        </div>
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="fr-icon-money-euro-circle-line"
            className="text-dsfr-orangeTerreBattue-main645-default"
            title="Prix de référence"
          />
          <div className="lg:flex lg:flex-col items-center">
            {prixReference}
            <span className="italic text-sm"> €/MWh</span>
          </div>
        </div>

        <div className="flex lg:flex-1 lg:flex-col items-center gap-2 lg:grow">
          <Icon
            id="fr-icon-cloud-fill"
            className="text-dsfr-grey-_625_425-default"
            title="Évaluation carbone"
          />
          <div>
            {evaluationCarboneSimplifiée > 0 ? (
              <div className="lg:flex lg:flex-col items-center text-center">
                {evaluationCarboneSimplifiée}
                <span className="italic text-sm"> kg eq CO2/kWc</span>
              </div>
            ) : (
              '- - -'
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="flex md:hidden">
      <Button
        linkProps={{
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        }}
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Button>
    </div>
  </div>
);
