import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type CandidatureListItemActionsProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  nomProjet: Candidature.Dépôt.RawType['nomProjet'];
  statutCandidature: Candidature.Instruction.RawType['statut'];
  actions: {
    télécharger?: { url: string };
    prévisualiser: boolean;
  };
};

export const CandidatureListItemActions: FC<CandidatureListItemActionsProps> = ({
  identifiantProjet,
  nomProjet,
  actions,
  statutCandidature,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();
  const estUneCandidatureLauréate = statutCandidature === 'classé';

  return (
    <div className="flex md:max-lg:flex-col gap-2">
      {actions.télécharger && (
        <Button
          className="whitespace-nowrap"
          linkProps={{
            href: Routes.Document.télécharger(actions.télécharger.url),
          }}
          title={`Afficher ${estUneCandidatureLauréate ? "l'attestation de désignation" : "l'avis de rejet"} au format PDF`}
          aria-label={`Afficher ${estUneCandidatureLauréate ? "l'attestation de désignation" : "l'avis de rejet"} du projet ${nomProjet} au format PDF`}
          priority="secondary"
          iconId="fr-icon-file-download-line"
          iconPosition="right"
        >
          {estUneCandidatureLauréate ? 'Attestation' : 'Avis de rejet'}
        </Button>
      )}
      {actions.prévisualiser && (
        <Button
          className="whitespace-nowrap"
          linkProps={{
            href: Routes.Candidature.prévisualiserAttestation(idProjet),
            target: '_blank',
          }}
          title={`Prévisualiser ${estUneCandidatureLauréate ? "l'attestation de désignation" : "l'avis de rejet"}`}
          aria-label={`Prévisualiser ${estUneCandidatureLauréate ? "l'attestation de désignation" : "l'avis de rejet"} du projet ${nomProjet} dans un nouvel onglet`}
          priority="secondary"
        >
          {estUneCandidatureLauréate ? 'Attestation' : 'Avis de rejet'}
        </Button>
      )}
      <Button
        className="whitespace-nowrap"
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
