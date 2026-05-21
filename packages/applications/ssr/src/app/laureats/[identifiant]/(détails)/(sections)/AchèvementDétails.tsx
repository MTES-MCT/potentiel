import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import type { ChampAvecMultiplesActions } from '../../_helpers';

export type AchèvementDétailsProps = ChampAvecMultiplesActions<
  PlainType<Lauréat.Achèvement.ConsulterAchèvementReadModel>
>;

export const AchèvementDétails = ({ value, actions }: AchèvementDétailsProps) => {
  return (
    <>
      {value.estAchevé && (
        <>
          {Option.isSome(value.attestation) ? (
            <DownloadDocument
              label="Télécharger l'attestation de conformité"
              url={Routes.Document.télécharger(DocumentProjet.bind(value.attestation).formatter())}
              format="pdf"
              className="mb-0"
              small
            />
          ) : (
            <span>L'attestation de conformité n'a pas été transmise</span>
          )}
          {Option.isSome(value.rapportAssocié) ? (
            <DownloadDocument
              label="Télécharger le rapport associé"
              url={Routes.Document.télécharger(
                DocumentProjet.bind(value.rapportAssocié).formatter(),
              )}
              format="pdf"
              className="mb-0"
              small
            />
          ) : (
            <span>Le rapport associé n'a pas été transmis</span>
          )}
          {Option.isSome(value.preuveTransmissionAuCocontractant) && (
            <DownloadDocument
              label="Télécharger la preuve de transmission au Cocontractant"
              url={Routes.Document.télécharger(
                DocumentProjet.bind(value.preuveTransmissionAuCocontractant).formatter(),
              )}
              format="pdf"
              className="mb-0"
              small
            />
          )}
        </>
      )}
      {actions.map(({ label, url }) => (
        <TertiaryLink key={label} href={url}>
          {label}
        </TertiaryLink>
      ))}
    </>
  );
};
