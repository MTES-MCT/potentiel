import { FC, ReactNode } from 'react';
import Link from 'next/link';

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
  <div className="w-full md:relative">
    <ProjectListItemHeading
      identifiantProjet={identifiantProjet}
      nomProjet={nomProjet}
      prefix="Candidature du projet"
      statut={statut}
    />
    <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-3 w-full">
      <div className="flex-1">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:mr-4">
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
                  {puissanceProductionAnnuelle} <Unit>{unitePuissance}</Unit>
                </div>
              </div>
              <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
                <Icon
                  id="fr-icon-money-euro-circle-line"
                  className="text-dsfr-orangeTerreBattue-main645-default"
                  title="Prix de référence"
                />
                <div className="lg:flex lg:flex-col items-center">
                  {prixReference} <Unit>€/MWh</Unit>
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
                      <Unit> kg eq CO2/kWc</Unit>
                    </div>
                  ) : (
                    '- - -'
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:absolute md:top-2 md:right-4">
              <Link
                href={Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter())}
                className="self-center mt-4 md:self-end md:mt-0"
                aria-label={`Lien vers la page de la candidature ${nomProjet}`}
              >
                Consulter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Unit = ({ children }: { children: ReactNode }) => (
  <span className="italic text-sm">{children}</span>
);
