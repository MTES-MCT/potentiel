import React from 'react';
import { getVolumeReserve } from '../../../../modules/demandeModification';
import { ProjectAppelOffre } from '../../../../entities';
import { AlertBox } from '../../../components';

type AlertOnPuissanceExceedMaxProps = {
  project: {
    appelOffre?: ProjectAppelOffre;
  };
};
export const AlertePuissanceMaxDepassee = ({ project }: AlertOnPuissanceExceedMaxProps) => {
  if (!project.appelOffre) {
    return null;
  }

  const { appelOffre } = project;
  const reservedVolume = getVolumeReserve(appelOffre);

  return reservedVolume ? (
    <AlertBox className="mt-4">
      Votre projet étant dans le volume réservé, les modifications de la Puissance installée ne
      peuvent pas dépasser le plafond de puissance de {reservedVolume.puissanceMax}{' '}
      {appelOffre.unitePuissance} spécifié au paragraphe 1.2.2 du cahier des charges.
    </AlertBox>
  ) : null;
};
