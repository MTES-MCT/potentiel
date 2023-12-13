import React from 'react';
import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../entities';
import { AlertBox } from '../../../components';

type AlertePuissanceFourchetteRatioInitialEtCDC2022Props = {
  project: {
    appelOffre: ProjectAppelOffre;
    cahierDesCharges: CahierDesChargesRéférenceParsed;
  };
};
export const AlertePuissanceFourchetteRatioInitialEtCDC2022 = ({
  project,
}: AlertePuissanceFourchetteRatioInitialEtCDC2022Props) => {
  const alerteMessage = project.appelOffre.periode.cahiersDesChargesModifiésDisponibles.find(
    (cdc) =>
      cdc.type === project.cahierDesCharges.type &&
      cdc.paruLe === project.cahierDesCharges.paruLe &&
      cdc.alternatif === project.cahierDesCharges.alternatif,
  )?.seuilSupplémentaireChangementPuissance?.paragrapheAlerte;

  return (
    <AlertBox className="mt-4">
      <span className="font-bold">
        Si vous ne respectez pas les conditions suivantes, cela pourrait impacter la remise de votre
        attestation de conformité.
      </span>
      <br />
      {alerteMessage ? alerteMessage : ''}
    </AlertBox>
  );
};
