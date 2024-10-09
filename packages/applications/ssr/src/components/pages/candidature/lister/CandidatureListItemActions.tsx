import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

export type CandidatureListItemActionsProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  nomProjet: Candidature.ConsulterCandidatureReadModel['nomProjet'];
  actions:
    | { télécharger: true; prévisualiser: false }
    | { télécharger: false; prévisualiser: false }
    | { télécharger: false; prévisualiser: true };
};

export const CandidatureListItemActions: FC<CandidatureListItemActionsProps> = ({
  identifiantProjet,
  nomProjet,
  actions,
}) => {
  return (
    <div className="flex md:max-lg:flex-col gap-2">
      <Button
        className="md:flex ml-auto"
        linkProps={{
          // TODO Routes.Candidature.détails
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        }}
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Button>
      {actions.télécharger && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Candidature.téléchargerAttestation(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
            ),
          }}
          title={`Télécharger l'attestation de désignation de ${nomProjet}`}
          aria-label={`Télécharger l'attestation de désignation de ${nomProjet}`}
          priority="secondary"
          iconId="fr-icon-file-download-line"
          iconPosition="right"
        >
          Attestation
        </Button>
      )}
      {actions.prévisualiser && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Candidature.prévisualiserAttestation(
              IdentifiantProjet.bind(identifiantProjet).formatter(),
            ),
            target: '_blank',
          }}
          title={`Prévisualiser l'attestation de désignation de ${nomProjet}`}
          aria-label={`Prévisualiser l'attestation de désignation de ${nomProjet}`}
          priority="secondary"
        >
          Attestation
        </Button>
      )}
    </div>
  );
};
