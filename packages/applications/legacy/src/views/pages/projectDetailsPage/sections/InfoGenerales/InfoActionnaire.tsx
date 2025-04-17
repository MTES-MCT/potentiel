import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type InfoActionnaireProps = {
  actionnaire: GetActionnaireForProjectPage;
  modificationsPermisesParLeCDCActuel: boolean;
};

export const InfoActionnaire = ({
  actionnaire,
  modificationsPermisesParLeCDCActuel,
}: InfoActionnaireProps) => {
  return (
    <div>
      <Heading3 className="m-0">Actionnaire</Heading3>
      <p className="m-0">{actionnaire.nom || 'Non renseigné'}</p>
      {modificationsPermisesParLeCDCActuel && actionnaire.affichage && (
        <Link
          href={actionnaire.affichage.url}
          aria-label={actionnaire.affichage.projectPageLabel}
          className="mt-1"
        >
          {actionnaire.affichage.projectPageLabel}
        </Link>
      )}
    </div>
  );
};
