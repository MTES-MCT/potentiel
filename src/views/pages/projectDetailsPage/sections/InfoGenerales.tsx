import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { BuildingIcon, Heading3, Link, Section } from '../../../components';
import routes from '../../../../routes';
import { UserRole } from '../../../../modules/users';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import {
  GarantiesFinancières,
  GarantiesFinancièresDataForProjetPage,
} from './GarantiesFinancières';

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
  garantiesFinancières?: GarantiesFinancièresDataForProjetPage;
};

export const InfoGenerales = ({ project, role, garantiesFinancières }: InfoGeneralesProps) => (
  <Section title="Informations générales" icon={<BuildingIcon />} className="flex flex-col">
    <div className="mb-6">
      <Heading3 className="m-0 flex text-sm font-semibold tracking-wide uppercase">
        puissance
      </Heading3>
      <p className="my-0">
        Puissance installée : {project.puissance} {project.appelOffre?.unitePuissance}
      </p>
    </div>
    <div className="mb-6">
      <Heading3 className="m-0 flex text-sm font-semibold tracking-wide uppercase">
        site de production{' '}
      </Heading3>
      <div>
        <span className="m-0">{project.adresseProjet}</span>
        <br />
        <span className="m-0">
          {project.codePostalProjet} {project.communeProjet}
        </span>
        <br />
        <span className="m-0">
          {project.departementProjet}, {project.regionProjet}
        </span>
      </div>
    </div>

    {project.isClasse &&
    !project.isAbandoned &&
    ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
      role,
    ) ? (
      <div className="mb-6">
        <Heading3 className="m-0 flex text-sm font-semibold tracking-wide uppercase">
          raccordement au réseau
        </Heading3>
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

    {project.appelOffre.isSoumisAuxGF &&
      ['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'caisse-des-dépôts', 'cre'].includes(
        role,
      ) && (
        <GarantiesFinancières
          userRole={role}
          garantiesFinancières={garantiesFinancières}
          identifiantProjet={convertirEnIdentifiantProjet({
            appelOffre: project.appelOffreId,
            période: project.periodeId,
            famille: project.familleId,
            numéroCRE: project.numeroCRE,
          }).formatter()}
        />
      )}
  </Section>
);
