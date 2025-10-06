import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type CandidatureListItemActionsProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  nomProjet: Candidature.Dépôt.RawType['nomProjet'];
  actions: {
    télécharger: boolean;
    prévisualiser: boolean;
  };
};

export const CandidatureListItemActions: FC<CandidatureListItemActionsProps> = ({
  identifiantProjet,
  nomProjet,
  actions,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return (
    <div className="flex md:max-lg:flex-col gap-2">
      {actions.télécharger && (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Candidature.téléchargerAttestation(idProjet),
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
            href: Routes.Candidature.prévisualiserAttestation(idProjet),
            target: '_blank',
          }}
          title={`Prévisualiser l'attestation de désignation de ${nomProjet}`}
          aria-label={`Prévisualiser l'attestation de désignation de ${nomProjet}`}
          priority="secondary"
        >
          Attestation
        </Button>
      )}
      <Button
        className="md:flex ml-auto"
        linkProps={{
          href: Routes.Candidature.détails(idProjet),
        }}
        aria-label={`Lien vers la page de la candidature ${nomProjet}`}
      >
        Consulter
      </Button>
    </div>
  );
};
