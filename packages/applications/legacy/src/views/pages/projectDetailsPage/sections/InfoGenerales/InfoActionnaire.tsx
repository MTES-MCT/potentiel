import React from 'react';
import { Heading3, Link } from '../../../../components';
import { Routes } from '@potentiel-applications/routes';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type InfoActionnaireProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: GetActionnaireForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
};

export const InfoActionnaire = ({
  identifiantProjet,
  actionnaire,
  modificationsNonPermisesParLeCDCActuel,
}: InfoActionnaireProps) => {
  return (
    <div>
      <Heading3 className="m-0">Actionnaire</Heading3>
      <p className="m-0">{actionnaire?.nom ?? 'Non renseigné'}</p>
      {!modificationsNonPermisesParLeCDCActuel && actionnaire?.affichage && (
        <Link href={actionnaire.affichage.url} aria-label="Modifier" className="mt-1">
          {actionnaire.affichage.label}
        </Link>
      )}
      {actionnaire?.afficherLienChangementSurPageProjet && (
        <Link
          href={Routes.Actionnaire.détails(identifiantProjet.formatter())}
          aria-label="Voir la demande de modification de l'actionnariat en cours"
          className="block"
        >
          Voir la demande de modification
        </Link>
      )}
    </div>
  );
};
