import { Routes } from '@potentiel-applications/routes';

import { TertiaryLink } from '../../../../../components/atoms/form/TertiaryLink';
import { DownloadDocument } from '../../../../../components/atoms/form/document/DownloadDocument';
import { GetAchèvementData } from '../_helpers/getAchèvementData';

import { Section } from './Section';

export type Props = { achèvement: GetAchèvementData };

export const AchèvementSection = ({
  achèvement: {
    value: { attestation, preuveTransmissionAuCocontractant },
    actions,
  },
}: Props) => {
  return (
    <Section title="Achèvement">
      {attestation && (
        <DownloadDocument
          label="Télécharger l'attestation de conformité"
          url={Routes.Document.télécharger(attestation)}
          format="pdf"
          className="mb-0"
        />
      )}
      {preuveTransmissionAuCocontractant && (
        <DownloadDocument
          label="Télécharger la preuve de transmission au cocontractant"
          url={Routes.Document.télécharger(preuveTransmissionAuCocontractant)}
          format="pdf"
          className="mb-0"
        />
      )}
      {
        <>
          {actions.map(({ label, url }) => (
            <TertiaryLink key={label} href={url}>
              {label}
            </TertiaryLink>
          ))}
        </>
      }
    </Section>
  );
};
