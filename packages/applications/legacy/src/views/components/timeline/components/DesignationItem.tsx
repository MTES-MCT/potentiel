import React from 'react';
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.';
import { Routes } from '@potentiel-applications/routes';
import { DownloadLink, DownloadLinkButton } from '../../UI';
import { DesignationItemProps } from '../helpers';

export const DesignationItem = ({
  date,
  projectStatus,
  identifiantProjet,
  isLegacy,
}: DesignationItemProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Notification des résultats" />
        {!isLegacy && (
          <Attestation projectStatus={projectStatus} identifiantProjet={identifiantProjet} />
        )}
      </ContentArea>
    </>
  );
};

type CertificateProps = {
  projectStatus: DesignationItemProps['projectStatus'];
  identifiantProjet: DesignationItemProps['identifiantProjet'];
};

const Attestation = ({ projectStatus, identifiantProjet }: CertificateProps) => {
  const urlTitle = projectStatus === 'Eliminé' ? "l'avis de rejet" : "l'attestation de désignation";

  return (
    <DownloadLink
      fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
      className="m-auto"
    >
      Télécharger {urlTitle}
    </DownloadLink>
  );
};
