import React from 'react';
import { ProjectDataForProjectPage } from '@modules/project';
import { BuildingIcon, Heading3, Link, Section } from '@components';
import routes from '@routes';
import { UserRole } from '@modules/users';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
};

export const InfoGenerales = ({ project, role }: InfoGeneralesProps) => (
  <Section title="Informations générales" icon={<BuildingIcon />} className="flex gap-4 flex-col">
    <div>
      <Heading3 className="m-0">Performances</Heading3>
      <p className="m-0">
        Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
      </p>
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
    ) ? (
      <div className="mb-3">
        <Heading3 className="mb-0">Raccordement au réseau</Heading3>
        <Link
          href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(
            convertirEnIdentifiantProjet({
              appelOffre: project.appelOffreId,
              période: project.periodeId,
              famille: project.familleId,
              numéroCRE: project.numeroCRE,
            }).formatter(),
          )}
        >
          Mettre à jour ou consulter les données de raccordement
        </Link>
      </div>
    ) : null}
  </Section>
);
