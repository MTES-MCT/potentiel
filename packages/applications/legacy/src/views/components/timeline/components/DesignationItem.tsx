import React from 'react';
import { ItemDate, PastIcon, ItemTitle, ContentArea } from '.';
import { DesignationItemProps } from '../helpers/extractDesignationItemProps';

// TODO: revoir cette partie
// en trouvant la date de génération (date de notification) ?

export const DesignationItem = ({
  certificate,
  date,
  projectStatus,
  identifiantProjet,
}: DesignationItemProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Notification des résultats" />
        {/* <Attestation {...{ certificate, projectStatus, identifiantProjet }} /> */}
      </ContentArea>
    </>
  );
};

// type CertificateProps = {
//   certificate?: Exclude<DesignationItemProps['certificate'], undefined>;
//   projectStatus: DesignationItemProps['projectStatus'];
//   identifiantProjet: DesignationItemProps['identifiantProjet'];
// };

// const Attestation = ({ certificate, projectStatus, identifiantProjet }: CertificateProps) => {
//   const { status } = certificate;

//   if (status === 'not-applicable') {
//     return <span>Attestation non disponible pour cette période</span>;
//   }

//const { url: fileUrl, date } = certificate;

//   const urlTitle =
//     projectStatus === 'Eliminé'
//       ? status === 'generated'
//         ? `avis de rejet (édité`
//         : `avis de rejet (transmis`
//       : status === 'generated'
//         ? `attestation de désignation (éditée`
//         : `attestation de désignation (transmise`;

//   return (
//     <DownloadLinkButton
//       fileUrl={Routes.Candidature.téléchargerAttestation(identifiantProjet)}
//       className="m-auto"
//     >
//       {`Télécharger l'${urlTitle}})  le ${afficherDate(
// date,)})`}
//     </DownloadLinkButton>
//   );
// };
