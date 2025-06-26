import Link from 'next/link';
import React from 'react';
import { GetReprésentantLégalForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';
import { Heading3 } from '../../../../components';
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
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Représentant légal</Heading3>
      <span>{représentantLégal.nom}</span>
      {afficherSelonRole && représentantLégal.affichage && (
        <Link href={représentantLégal.affichage.url} aria-label={représentantLégal.affichage.label}>
          {représentantLégal.affichage.label}
        </Link>
      )}
    </div>
  );
};
