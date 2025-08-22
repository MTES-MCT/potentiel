import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Candidature, GetProjetAggregateRoot } from '@potentiel-domain/projet';
import type { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type SoumettreDépôtGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    soumisPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerDépôtSoumettreGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<SoumettreDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    soumisLe,
    type,
    dateÉchéance,
    soumisPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.soumettreDépôt({
      identifiantProjet,
      attestation,
      dateConstitution,
      soumisLe,
      type,
      dateÉchéance,
      soumisPar,
    });
    // Temporaire : le load doit être fait après pour que l'aggrégat soit à jour
    const projet = await getProjetAggregateRoot(identifiantProjet);
    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.annulerTâchesPlanififées();
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
    handler,
  );
};
