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
      Une autorisation est nécessaire si la modification de puissance dépasse la puissance maximum
      de {reservedVolume.puissanceMax} {appelOffre.unitePuissance} du volume reservé de l'appel
      d'offre. Dans ce cas{' '}
      <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </AlertBox>
  ) : null;
};
