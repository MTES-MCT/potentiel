import React from 'react';
import { Heading3, Link } from '../../../../components';
import { Routes } from '@potentiel-applications/routes';

import { GetActionnaireForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type InfoActionnaireProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: GetActionnaireForProjectPage;
};

export const InfoActionnaire = ({ identifiantProjet, actionnaire }: InfoActionnaireProps) => {
  return (
    <div>
      <Heading3 className="m-0">Actionnaire</Heading3>
      <p className="m-0">{actionnaire?.nom ?? 'Non renseigné'}</p>
      {actionnaire?.pageProjet && (
        <Link href={actionnaire.pageProjet.url} aria-label="Modifier" className="mt-1">
          {actionnaire.pageProjet.label}
        </Link>
      )}
      {actionnaire?.peutConsulterDemandeChangement && (
        <Link
          href={Routes.Actionnaire.changement.détail(identifiantProjet.formatter())}
          aria-label="Voir la demande de changement d'actionnaire en cours"
          className="block"
        >
          Voir la demande de changement
        </Link>
      )}
    </div>
  );
};
