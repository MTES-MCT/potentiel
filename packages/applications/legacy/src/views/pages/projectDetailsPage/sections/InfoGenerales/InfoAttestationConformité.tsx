import React from 'react';

import { DownloadLink, Heading3, Link } from '../../../../components';
import { Routes } from '@potentiel-applications/routes';

import { DocumentProjet, IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export type Props = {
  attestationConformité: DocumentProjet.RawType;
  preuveTransmissionAuCocontractant?: DocumentProjet.RawType;
  identifiantProjet: IdentifiantProjet.ValueType;
  role: Role.ValueType;
};

export const InfoAttestationConformité = ({
  attestationConformité,
  preuveTransmissionAuCocontractant,
  identifiantProjet,
  role,
}: Props) => {
  return (
    <div className="flex flex-col">
      <Heading3 className="m-0">Achèvement</Heading3>
      <DownloadLink fileUrl={Routes.Document.télécharger(attestationConformité)} className="m-0">
        Télécharger l'attestation de conformité
      </DownloadLink>
      {preuveTransmissionAuCocontractant && (
        <DownloadLink
          fileUrl={Routes.Document.télécharger(preuveTransmissionAuCocontractant)}
          className="m-0"
        >
          Télécharger la preuve de transmission au cocontractant
        </DownloadLink>
      )}
      {role.aLaPermission('achèvement.modifier') && (
        <Link
          href={Routes.Achèvement.modifierAttestationConformité(identifiantProjet.formatter())}
          aria-label="Modifier les informations d'achèvement du projet"
          className="mt-1"
        >
          Modifier
        </Link>
      )}
    </div>
  );
};
