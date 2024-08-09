import React from 'react';
import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../entities';
import { getRatiosChangementPuissance } from '../../../../modules/demandeModification';
import { AlertBox } from '../../../components';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type AlertOnPuissanceOutsideRatiosProps = {
  project: {
    appelOffre: ProjectAppelOffre;
    technologie: AppelOffre.Technologie;
    cahierDesCharges: CahierDesChargesRéférenceParsed;
  };
};
export const AlertePuissanceHorsRatios = ({ project }: AlertOnPuissanceOutsideRatiosProps) => {
  const { min, max } = getRatiosChangementPuissance(project);

  return (
    <AlertBox className="mt-4">
      Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
      {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%.
      Dans ces cas <strong>il est nécessaire de joindre un justificatif à votre demande</strong>.
    </AlertBox>
  );
};
