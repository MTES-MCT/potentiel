import React from 'react';
import {
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsRatiosChangementPuissance,
  getRatiosChangementPuissance,
  getVolumeReserve,
} from '../../../../modules/demandeModification/demandeChangementDePuissance';

import { parseCahierDesChargesRéférence } from '../../../../entities';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest/dtos';
import { AlertBox, Checkbox } from '../../../components';
import { UploadResponseFile } from './UploadResponseFile';

type PuissanceFormProps = {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' };
};

export const PuissanceForm = ({ modificationRequest }: PuissanceFormProps) => {
  const { project, puissance: nouvellePuissance } = modificationRequest;
  const cahierDesCharges = parseCahierDesChargesRéférence(project.cahierDesChargesActuel);
  const exceedsRatios = exceedsRatiosChangementPuissance({
    project: {
      ...project,
      cahierDesCharges,
    },
    nouvellePuissance,
  });
  const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({ project, nouvellePuissance });
  const ratios = getRatiosChangementPuissance({
    ...project,
    cahierDesCharges,
  });
  const reservedVolume = project.appelOffre && getVolumeReserve(project.appelOffre);

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(
    project.cahierDesChargesActuel,
  );

  return (
    <>
      <UploadResponseFile
        modificationRequest={modificationRequest}
        optionnel={true}
        reasonForOptionnel={`en cas de refus ou de décision favorable de l'État`}
      />
      <div>
        <div>
          Nouvelle puissance demandée :{' '}
          <span className="font-bold">
            {modificationRequest.puissance} {modificationRequest.project.unitePuissance}
          </span>
        </div>
        <input type="hidden" value={modificationRequest.puissance} name="puissance" />

        {!CDC2022choisi && exceedsRatios && (
          <AlertBox className="mt-2">
            La nouvelle puissance demandée est inférieure à {Math.round(ratios.min * 100)}% de la
            puissance initiale ou supérieure à {Math.round(ratios.max * 100)}%.{' '}
          </AlertBox>
        )}
        {exceedsPuissanceMax && reservedVolume && (
          <AlertBox className="mt-2">
            La nouvelle puissance demandée dépasse la puissance maximum de{' '}
            {reservedVolume.puissanceMax} {modificationRequest.project.unitePuissance} du volume
            reservé de l'appel d'offre.
          </AlertBox>
        )}
      </div>

      <div className="form__group mb-4">
        <Checkbox id="statusUpdateOnly" name="isDecisionJustice">
          La demande de changement de puissance fait suite à une décision de l'État
        </Checkbox>
        <div style={{ fontSize: 11, lineHeight: '1.5em', marginTop: 3 }}>
          En cochant cette case, vous devrez joindre un courrier uniquement en cas de refus.
        </div>
      </div>
    </>
  );
};
