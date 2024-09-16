import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

export type CandidatureListItemActionsProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  nomProjet: Candidature.ConsulterCandidatureReadModel['nomProjet'];
  showDownloadAttestation: boolean;
  showPreviewAttestation: boolean;
};

export const CandidatureListItemActions: FC<CandidatureListItemActionsProps> = ({
  identifiantProjet,
  nomProjet,
  showDownloadAttestation,
  showPreviewAttestation,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        className="md:flex ml-auto"
        linkProps={{
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        }}
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Button>
      {showDownloadAttestation && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Candidature.téléchargerAttestation(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
            ),
          }}
          aria-label={`Télécharger l'attestation de désignation de ${nomProjet}`}
          priority="secondary"
        >
          Télécharger l'attestation
        </Button>
      )}
      {showPreviewAttestation && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Candidature.prévisualiserAttestation(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
            ),
            target: '_blank',
          }}
          aria-label={`Prévisualiser l'attestation de désignation de ${nomProjet}`}
          priority="secondary"
        >
          Voir l'attestation
        </Button>
      )}
    </div>
  );
};