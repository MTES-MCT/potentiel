import React from 'react';
import routes from '@routes';
import { Link } from '@components';
import { afficherDate } from '../helpers/afficherDate';

export type ProjectProps = {
  id: string;
  nomProjet: string;
  nomCandidat: string;
  communeProjet: string;
  regionProjet: string;
  departementProjet: string;
  periodeId: string;
  familleId: string | undefined;
  notifiedOn: number;
  appelOffreId: string;
  identifiantGestionnaire?: string;
  gestionnaireRéseau?: { codeEIC: string; raisonSociale: string };
  puissance?: number;
  unitePuissance?: string;
};

type ProjectInfoProps = {
  project: ProjectProps;
  children?: React.ReactNode;
  className?: string;
};

export const ProjectInfo = ({ project, children, className = '' }: ProjectInfoProps) => {
  const {
    id,
    nomProjet,
    nomCandidat,
    communeProjet,
    regionProjet,
    departementProjet,
    periodeId,
    familleId,
    notifiedOn,
    appelOffreId,
    identifiantGestionnaire,
    gestionnaireRéseau,
    puissance,
    unitePuissance,
  } = project;

  return (
    <div
      className={`${className} p-4 bg-gray-100 border-solid border-l-4 border-y-0 border-r-0 border-blue-france-main-525-base`}
    >
      <div>
        <Link href={routes.PROJECT_DETAILS(id)}>{nomProjet}</Link>
      </div>
      <div className="italic text-xs">
        <span>{nomCandidat}</span>
        <br />
        <span>{communeProjet}</span>, <span>{departementProjet}</span>, <span>{regionProjet}</span>
      </div>
      <div>
        {puissance} {unitePuissance}
      </div>
      <p className="m-0">
        Désigné le <span>{afficherDate(notifiedOn)}</span> pour la période{' '}
        <span>
          {appelOffreId} {periodeId}
        </span>{' '}
        {familleId && <span>famille {familleId}</span>}
      </p>
      {identifiantGestionnaire && (
        <div>Identifiant dossier de raccordement : {identifiantGestionnaire}</div>
      )}
      {gestionnaireRéseau && (
        <div>
          Gestionnaire de réseau: {gestionnaireRéseau.raisonSociale} ({gestionnaireRéseau.codeEIC})
        </div>
      )}
      {children}
    </div>
  );
};
