import React from 'react';
import { Heading3, Link } from '../../../../components';
import { Routes } from '@potentiel-applications/routes';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type InfoActionnaireProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: GetActionnaireForProjectPage;
  modificationParPorteurNonPermise: boolean;
};

export const InfoActionnaire = ({
  identifiantProjet,
  actionnaire,
  modificationParPorteurNonPermise,
}: InfoActionnaireProps) => {
  return (
    <div>
      <Heading3 className="m-0">Actionnaire</Heading3>
      <p className="m-0">{actionnaire?.nom ?? 'Non renseigné'}</p>
      {!modificationParPorteurNonPermise && actionnaire?.pageProjet && (
        <Link href={actionnaire.pageProjet.url} aria-label="Modifier" className="mt-1">
          {actionnaire.pageProjet.label}
        </Link>
      )}
      {actionnaire?.peutConsulterDemandeChangement && (
        <Link
          href={Routes.Actionnaire.changement.détail(identifiantProjet.formatter())}
          aria-label="Voir la demande de modification de l'actionnariat en cours"
          className="block"
        >
          Voir la demande de modification
        </Link>
      )}
    </div>
  );
};
