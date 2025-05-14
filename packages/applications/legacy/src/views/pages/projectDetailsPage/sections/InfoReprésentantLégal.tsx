import Link from 'next/link';
import React from 'react';
import { GetReprésentantLégalForProjectPage } from '../../../../controllers/project/getProjectPage/_utils';
import { Heading3 } from '../../../components';
import { Role } from '@potentiel-domain/utilisateur';

export const InfoReprésentantLégal = ({
  représentantLégal,
  modificationsPermisesParLeCDCActuel,
  role,
}: {
  représentantLégal: GetReprésentantLégalForProjectPage;
  modificationsPermisesParLeCDCActuel: boolean;
  role: Role.ValueType;
}) => {
  const afficherSelonRole =
    (role.estPorteur() && modificationsPermisesParLeCDCActuel) || !role.estPorteur();

  return (
    <>
      <Heading3 className="mb-1">Représentant légal</Heading3>
      <div>{représentantLégal.nom}</div>
      {afficherSelonRole && représentantLégal.affichage && (
        <Link
          href={représentantLégal.affichage.url}
          aria-label={représentantLégal.affichage.label}
          className="mt-1"
        >
          {représentantLégal.affichage.label}
        </Link>
      )}
    </>
  );
};
