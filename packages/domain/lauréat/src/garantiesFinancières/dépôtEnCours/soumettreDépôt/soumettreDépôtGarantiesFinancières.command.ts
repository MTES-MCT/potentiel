import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature, GetProjetAggregateRoot } from '@potentiel-domain/projet';

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
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await garantiesFinancières.soumettreDépôt({
      identifiantProjet,
      attestation,
      dateConstitution,
      soumisLe,
      type,
      dateÉchéance,
      soumisPar,
    });
    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.annulerTâchesPlanififées();
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
    handler,
  );
};
