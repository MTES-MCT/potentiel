import React from 'react';

import { DownloadLink, Heading3, Link } from '../../../../components';
import { Routes } from '@potentiel-applications/routes';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { GetAttestationDeConformitéForProjectPage } from '../../../../../controllers/project/getProjectPage/_utils';

export type Props = {
  attestationConformité: GetAttestationDeConformitéForProjectPage;
  identifiantProjet: IdentifiantProjet.ValueType;
  role: Role.ValueType;
};

export const InfoAttestationConformité = ({
  attestationConformité,
  identifiantProjet,
  role,
}: Props) => {
  return (
    <div className="flex flex-col">
      <Heading3 className="m-0">Achèvement</Heading3>
      <DownloadLink
        fileUrl={Routes.Document.télécharger(attestationConformité.attestation)}
        className="m-0"
      >
        Télécharger l'attestation de conformité
      </DownloadLink>
      <DownloadLink
        fileUrl={Routes.Document.télécharger(
          attestationConformité.preuveTransmissionAuCocontractant,
        )}
        className="m-0"
      >
        Télécharger la preuve de transmission au cocontractant
      </DownloadLink>
      {role.aLaPermission('achèvement.attestationConformité.modifier') && (
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
