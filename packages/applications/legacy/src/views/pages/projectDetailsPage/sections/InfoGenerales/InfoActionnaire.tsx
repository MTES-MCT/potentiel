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
      <p className="m-0">{actionnaire.nom || 'Non renseigné'}</p>
      {!modificationsNonPermisesParLeCDCActuel && actionnaire.affichage && (
        <Link href={actionnaire.affichage.url} aria-label="Modifier" className="mt-1">
          {actionnaire.affichage.label}
        </Link>
      )}
      {actionnaire?.demandeEnCours && (
        <Link
          href={Routes.Actionnaire.changement.détails(
            identifiantProjet.formatter(),
            actionnaire.demandeEnCours.demandéeLe,
          )}
          aria-label="Voir la demande de modification en cours de l'actionnariat"
          className="block"
        >
          Voir la demande de modification
        </Link>
      )}
    </div>
  );
};
