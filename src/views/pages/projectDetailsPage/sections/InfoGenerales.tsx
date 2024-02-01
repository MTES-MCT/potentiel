import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section } from '../../../components';
import { UserRole } from '../../../../modules/users';
import { Routes } from '@potentiel-libraries/routes';
import { formatProjectAODataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
};

export const InfoGenerales = ({ project, role }: InfoGeneralesProps) => {
  const puissanceInférieurePuissanceMaxVolRéservé =
    project.appelOffre.periode.noteThresholdBy === 'category' &&
    project.puissance < project.appelOffre.periode.noteThreshold.volumeReserve.puissanceMax;

  return (
    <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-4 flex-col">
      <div>
        <Heading3 className="m-0">Performances</Heading3>
        <p className="m-0">
          Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
        </p>
        {project.désignationCatégorie === 'volume-réservé' && (
          <p className="mb-0 mt-1">Ce projet fait partie du volume réservé de la période.</p>
        )}
        {project.désignationCatégorie === 'hors-volume-réservé' &&
          puissanceInférieurePuissanceMaxVolRéservé && (
            <p className="mb-0 mt-1">
              Ce projet ne fait pas partie du volume réservé de la période.
            </p>
          )}
      </div>

      <div>
        <Heading3 className="mb-0">Site de production</Heading3>
        <p className="m-0">{project.adresseProjet}</p>
        <p className="m-0">
          {project.codePostalProjet} {project.communeProjet}
        </p>
        <p className="m-0">
          {project.departementProjet}, {project.regionProjet}
        </p>
      </div>
      {project.isClasse &&
        !project.isAbandoned &&
        ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
          role,
        ) && (
          <div className="print:hidden mb-3">
            <Heading3 className="mb-0">Raccordement au réseau</Heading3>
            <Link
              href={Routes.Raccordement.détail(
                formatProjectAODataToIdentifiantProjetValueType({
                  appelOffreId: project.appelOffreId,
                  periodeId: project.periodeId,
                  familleId: project.familleId,
                  numeroCRE: project.numeroCRE,
                }).formatter(),
              )}
            >
              Mettre à jour ou consulter les données de raccordement
            </Link>
          </div>
        )}
    </Section>
  );
};
