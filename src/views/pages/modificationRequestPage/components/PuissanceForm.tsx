import React from 'react';
import {
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsRatiosChangementPuissance,
  getRatiosChangementPuissance,
  getVolumeReserve,
} from '@modules/demandeModification/demandeChangementDePuissance';

import { AlertBox, RichCheckbox } from '@components';
import { ModificationRequestPageDTO } from '@modules/modificationRequest/dtos';

type PuissanceFormProps = {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' };
};

export const PuissanceForm = ({ modificationRequest }: PuissanceFormProps) => {
  const { project, puissance: nouvellePuissance } = modificationRequest;
  const exceedsRatios = exceedsRatiosChangementPuissance({ project, nouvellePuissance });
  const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({ project, nouvellePuissance });
  const ratios = getRatiosChangementPuissance(project);
  const reservedVolume = project.appelOffre && getVolumeReserve(project.appelOffre);

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(
    project.cahierDesChargesActuel,
  );

  return (
    <>
      <div className="form__group mt-4">
        <label>
          Nouvelle puissance demandée : {modificationRequest.puissance}{' '}
          {modificationRequest.project.unitePuissance}
        </label>
        <input type="hidden" value={modificationRequest.puissance} name="puissance" />
      </div>

      {!CDC2022choisi && exceedsRatios && (
        <AlertBox className="mt-3">
          La nouvelle puissance demandée est inférieure à {Math.round(ratios.min * 100)}% de la
          puissance initiale ou supérieure à {Math.round(ratios.max * 100)}%.{' '}
        </AlertBox>
      )}
      {exceedsPuissanceMax && reservedVolume && (
        <AlertBox className="mt-3">
          La nouvelle puissance demandée dépasse la puissance maximum de{' '}
          {reservedVolume.puissanceMax} {modificationRequest.project.unitePuissance} du volume
          reservé de l'appel d'offre.
        </AlertBox>
      )}

      <div className="form__group mb-4">
        <RichCheckbox id="statusUpdateOnly" name="isDecisionJustice">
          La demande de changement de puissance fait suite à une décision de justice
        </RichCheckbox>
        <div style={{ fontSize: 11, lineHeight: '1.5em', marginTop: 3 }}>
          En cochant cette case, vous n'aurez pas à joindre de courrier de réponse en cas
          d'acceptation de la demande. <br />
          Un refus quant à lui devra être accompagné d'un courrier.
        </div>
      </div>
    </>
  );
};
