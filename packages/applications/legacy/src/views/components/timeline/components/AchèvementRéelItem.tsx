import React from 'react';
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.';
import { DownloadLink } from '../../UI';
import { Routes } from '@potentiel-applications/routes';
import { AchèvementRéelDTO } from '../../../../modules/frise';

export const AchèvementRéelItem = ({
  date,
  attestation,
  preuveTransmissionAuCocontractant,
}: AchèvementRéelDTO) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Date d'achèvement réelle" />
        <DownloadLink
          fileUrl={Routes.Document.télécharger(attestation)}
          aria-label={`Télécharger l'attestation de conformité`}
        >
          Télécharger l'attestation de conformité
        </DownloadLink>
        <DownloadLink
          fileUrl={Routes.Document.télécharger(preuveTransmissionAuCocontractant)}
          aria-label={`Télécharger la preuve de transmission au cocontractant`}
        >
          Télécharger la preuve de transmission au cocontractant
        </DownloadLink>
      </ContentArea>
    </>
  );
};
