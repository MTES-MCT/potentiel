import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { Role } from '@potentiel-domain/utilisateur';

export type InfoActionnaireProps = {
  actionnaire: GetActionnaireForProjectPage;
  modificationsPermisesParLeCDCActuel: boolean;
  role: Role.ValueType;
};

export const InfoActionnaire = ({
  actionnaire,
  modificationsPermisesParLeCDCActuel,
  role,
}: InfoActionnaireProps) => {
  const afficherSelonRole =
    (role.estPorteur() && modificationsPermisesParLeCDCActuel) || !role.estPorteur();

  return (
    <div>
      <Heading3 className="m-0">Actionnaire</Heading3>
      <p className="m-0">{actionnaire.nom || 'Non renseigné'}</p>
      {afficherSelonRole && actionnaire.affichage && (
        <Link
          href={actionnaire.affichage.url}
          aria-label={actionnaire.affichage.label}
          className="mt-1"
        >
          {actionnaire.affichage.label}
        </Link>
      )}
    </div>
  );
};
