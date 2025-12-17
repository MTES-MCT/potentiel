import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampAvecMultiplesActions } from '../../../_helpers';

export type AchèvementDétailsProps = ChampAvecMultiplesActions<
  PlainType<Lauréat.Achèvement.ConsulterAchèvementReadModel>
>;

export const AchèvementDétails = ({ value, actions }: AchèvementDétailsProps) => {
  return (
    <>
      {value.estAchevé && value.attestation && (
        <DownloadDocument
          label="Télécharger l'attestation de conformité"
          url={Routes.Document.télécharger(DocumentProjet.bind(value.attestation).formatter())}
          format="pdf"
          className="mb-0"
        />
      )}
      {value.estAchevé && Option.isSome(value.preuveTransmissionAuCocontractant) && (
        <DownloadDocument
          label="Télécharger la preuve de transmission au cocontractant"
          url={Routes.Document.télécharger(
            DocumentProjet.bind(value.preuveTransmissionAuCocontractant).formatter(),
          )}
          format="pdf"
          className="mb-0"
        />
      )}
      {actions.map(({ label, url }) => (
        <TertiaryLink key={label} href={url}>
          {label}
        </TertiaryLink>
      ))}
    </>
  );
};
