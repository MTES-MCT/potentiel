import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';

export type InfoActionnaireProps = {
  actionnaire: GetActionnaireForProjectPage;
};

export const InfoActionnaire = ({ actionnaire }: InfoActionnaireProps) => {
  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Actionnaire</Heading3>
      <span>{actionnaire.nom || 'Non renseigné'}</span>
      {actionnaire.affichage && (
        <Link href={actionnaire.affichage.url} aria-label={actionnaire.affichage.label}>
          {actionnaire.affichage.label}
        </Link>
      )}
    </div>
  );
};
