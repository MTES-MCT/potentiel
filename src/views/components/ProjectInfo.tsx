import React from 'react';
import { dataId } from '../../helpers/testId';
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
  puissance: number;
  unitePuissance: string;
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
      <div {...dataId('modificationRequest-item-nomProjet')}>
        <Link href={routes.PROJECT_DETAILS(id)}>{nomProjet}</Link>
      </div>
      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        <span {...dataId('modificationRequest-item-nomCandidat')}>{nomCandidat}</span>
        <br />
        <span {...dataId('modificationRequest-item-communeProjet')}>{communeProjet}</span>,{' '}
        <span {...dataId('modificationRequest-item-departementProjet')}>{departementProjet}</span>,{' '}
        <span {...dataId('modificationRequest-item-regionProjet')}>{regionProjet}</span>
      </div>
      <div {...dataId('modificationRequest-item-puissance')}>
        {puissance} {unitePuissance}
      </div>
      <p className="m-0">
        Désigné le{' '}
        <span {...dataId('modificationRequest-item-designationDate')}>
          {afficherDate(notifiedOn)}
        </span>{' '}
        pour la période{' '}
        <span {...dataId('modificationRequest-item-periode')}>
          {appelOffreId} {periodeId}
        </span>{' '}
        {familleId && (
          <span {...dataId('modificationRequest-item-famille')}>famille {familleId}</span>
        )}
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
