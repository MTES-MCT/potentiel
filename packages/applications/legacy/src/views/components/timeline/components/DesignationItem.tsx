import React from 'react';
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.';
import { Routes } from '@potentiel-applications/routes';
import { DownloadLink, DownloadLinkButton } from '../../UI';
import { DesignationItemProps } from '../helpers';

// TODO: revoir cette partie
// en trouvant la date de génération (date de notification) ?

export const DesignationItem = ({
  // date,
  projectStatus,
  identifiantProjet,
}: DesignationItemProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        {/* <ItemDate date={date} /> */}
        <ItemTitle title="Notification des résultats" />
        <Attestation projectStatus={projectStatus} identifiantProjet={identifiantProjet} />
      </ContentArea>
    </>
  );
};

type CertificateProps = {
  // certificate?: Exclude<DesignationItemProps['certificate'], undefined>;
  projectStatus: DesignationItemProps['projectStatus'];
  identifiantProjet: DesignationItemProps['identifiantProjet'];
};

const Attestation = ({ projectStatus, identifiantProjet }: CertificateProps) => {
  // const { status } = certificate;

  // if (status === 'not-applicable') {
  //   return <span>Attestation non disponible pour cette période</span>;
  // }

  // const { url: fileUrl, date } = certificate;

  // const urlTitle =
  //   projectStatus === 'Eliminé'
  //     ? status === 'generated'
  //       ? `avis de rejet (édité`
  //       : `avis de rejet (transmis`
  //     : status === 'generated'
  //       ? `attestation de désignation (éditée`
  //       : `attestation de désignation (transmise`;

  const urlTitle = projectStatus === 'Eliminé' ? "l'avis de rejet" : "l'attestation de désignation";

  return (
    <DownloadLink
      fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
      className="m-auto"
    >
      {urlTitle}
      {/* {`Télécharger l'${urlTitle}})  le ${afficherDate(date)})`} */}
    </DownloadLink>
  );
};
