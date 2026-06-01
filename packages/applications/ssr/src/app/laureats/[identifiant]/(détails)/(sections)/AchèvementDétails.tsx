import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import type { ChampAvecMultiplesActions } from '../../_helpers';

export type AchèvementDétailsProps = ChampAvecMultiplesActions<
  PlainType<Lauréat.Achèvement.ConsulterAchèvementReadModel>
> & { garantiesFinancièresLevées: boolean };

export const AchèvementDétails = ({
  value,
  actions,
  garantiesFinancièresLevées,
}: AchèvementDétailsProps) => {
  const descriptionNotice: string | undefined =
    value.estAchevé && !garantiesFinancièresLevées
      ? Option.isNone(value.attestation) && Option.isNone(value.rapportAssocié)
        ? `L'attestation de conformité et le rapport associé sont à transmettre`
        : Option.isNone(value.attestation)
          ? `L'attestation de conformité reste à transmettre`
          : Option.isNone(value.rapportAssocié)
            ? `Le rapport associé de l'attestation de conformité reste à transmettre`
            : undefined
      : undefined;

  return (
    <>
      {value.estAchevé && (
        <>
          {descriptionNotice && (
            <Notice
              description={descriptionNotice}
              title=""
              severity="info"
              className="print:hidden"
            />
          )}
          {Option.isSome(value.attestation) && (
            <DownloadDocument
              label="Télécharger l'attestation de conformité"
              url={Routes.Document.télécharger(DocumentProjet.bind(value.attestation).formatter())}
              format="pdf"
              className="mb-0"
              small
            />
          )}
          {Option.isSome(value.rapportAssocié) && (
            <DownloadDocument
              label="Télécharger le rapport associé"
              url={Routes.Document.télécharger(
                DocumentProjet.bind(value.rapportAssocié).formatter(),
              )}
              format="pdf"
              className="mb-0"
              small
            />
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
