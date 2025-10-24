import React from 'react';
import { Heading3, Link } from '../../../../components';

import { GetPuissanceForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils/getPuissance';
import { DésignationCatégorie } from '../../../../../modules/project';

export type InfoPuissanceProps = {
  puissance: GetPuissanceForProjectPage;
  unitePuissance: string;
  désignationCatégorie: DésignationCatégorie | undefined;
  puissanceInférieurePuissanceMaxVolRéservé: boolean;
};

export const InfoPuissance = ({
  puissance,
  unitePuissance,
  désignationCatégorie,
  puissanceInférieurePuissanceMaxVolRéservé,
}: InfoPuissanceProps) => {
  const volumeRéservéLabel =
    désignationCatégorie === 'volume-réservé'
      ? 'Ce projet fait partie du volume réservé de la période.'
      : désignationCatégorie === 'hors-volume-réservé' && puissanceInférieurePuissanceMaxVolRéservé
        ? 'Ce projet ne fait pas partie du volume réservé de la période'
        : undefined;

  return (
    <div className="flex flex-col gap-0">
      <Heading3 className="m-0">Performances</Heading3>
      <span>
        Puissance installée : {puissance.puissance} {unitePuissance}
      </span>
      {puissance.puissanceDeSite !== undefined && (
        <span>
          Puissance de site : {puissance.puissanceDeSite} {unitePuissance}
        </span>
      )}
      {volumeRéservéLabel && <span>{volumeRéservéLabel}</span>}
      {puissance.affichage && (
        <Link href={puissance.affichage.url} aria-label={puissance.affichage.label}>
          {puissance.affichage.label}
        </Link>
      )}
    </div>
  );
};
