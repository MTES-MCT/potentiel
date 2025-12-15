import { Routes } from '@potentiel-applications/routes';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { ConsulterAchèvementReadModel } from '@potentiel-domain/projet/src/lauréat/achèvement';
import { ChampAvecMultiplesActions } from '../../../_helpers/types';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';

export type AchèvementDétailsProps = ChampAvecMultiplesActions<
  PlainType<ConsulterAchèvementReadModel>
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
      {
        <>
          {actions.map(({ label, url }) => (
            <TertiaryLink key={label} href={url}>
              {label}
            </TertiaryLink>
          ))}
        </>
      }
    </>
  );
};
