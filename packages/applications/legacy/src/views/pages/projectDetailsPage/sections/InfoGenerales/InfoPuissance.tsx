import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { DésignationCatégorie } from '../../../../../modules/project';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type InfoPuissanceProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: GetPuissanceForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
  unitePuissance: string;
  désignationCatégorie: DésignationCatégorie | undefined;
  puissanceInférieurePuissanceMaxVolRéservé: boolean;
  legacyPuissance: number;
};

export const InfoPuissance = ({
  identifiantProjet,
  puissance,
  modificationsNonPermisesParLeCDCActuel,
  unitePuissance,
  désignationCatégorie,
  puissanceInférieurePuissanceMaxVolRéservé,
  legacyPuissance,
}: InfoPuissanceProps) => {
  return (
    <div>
      <Heading3 className="m-0">Performances</Heading3>
      <p className="m-0">
        Puissance installée : {puissance.puissance} {unitePuissance}
      </p>
      {/* les deux coexistent pour le moment à des fins d'audit en local / dev, à supprimer lors de la MEP */}
      <p className="m-0">
        Puissance legacy installée (à des fins d'audit) : {legacyPuissance} {unitePuissance}
      </p>
      {désignationCatégorie === 'volume-réservé' && (
        <p className="mb-0 mt-1">Ce projet fait partie du volume réservé de la période.</p>
      )}
      {désignationCatégorie === 'hors-volume-réservé' &&
        puissanceInférieurePuissanceMaxVolRéservé && (
          <p className="mb-0 mt-1">Ce projet ne fait pas partie du volume réservé de la période.</p>
        )}
      {!modificationsNonPermisesParLeCDCActuel && puissance.affichage && (
        <Link
          href={puissance.affichage.url}
          aria-label={puissance.affichage.labelPageProjet}
          className="mt-1"
        >
          {puissance.affichage.labelPageProjet}
        </Link>
      )}
      {puissance?.demandeEnCours && (
        <Link
          href={Routes.Puissance.changement.détails(
            identifiantProjet.formatter(),
            puissance.demandeEnCours.demandéeLe,
          )}
          aria-label="Voir la demande de modification en cours de puissance"
          className="block"
        >
          Voir la demande de modification
        </Link>
      )}
    </div>
  );
};
