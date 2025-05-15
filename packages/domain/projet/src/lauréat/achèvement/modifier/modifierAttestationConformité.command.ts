import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    attestation: DocumentProjet.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
    date: DateTime.ValueType;
  }
>;

export const registerModifierAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.modifierAttestationConformité(payload);
  };
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
    handler,
  );
};

// import { Message, MessageHandler, mediator } from 'mediateur';

// import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
// import { DocumentProjet } from '@potentiel-domain/document';
// import { LoadAggregate } from '@potentiel-domain/core';
// import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

// import { loadAchèvementFactory } from '../achèvement.aggregate';

// export type ModifierAttestationConformitéCommand = Message<
//   'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
//   {
//     identifiantProjet: IdentifiantProjet.ValueType;
//     attestation: DocumentProjet.ValueType;
//     dateTransmissionAuCocontractant: DateTime.ValueType;
//     preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
//     date: DateTime.ValueType;
//     utilisateur: IdentifiantUtilisateur.ValueType;
//   }
// >;

// export const registerModifierAttestationConformitéCommand = (loadAggregate: LoadAggregate) => {
//   const loadAchèvementAggregate = loadAchèvementFactory(loadAggregate);
//   const handler: MessageHandler<ModifierAttestationConformitéCommand> = async ({
//     identifiantProjet,
//     attestation,
//     dateTransmissionAuCocontractant,
//     preuveTransmissionAuCocontractant,
//     date,
//     utilisateur,
//   }) => {
//     const attestationConformité = await loadAchèvementAggregate(identifiantProjet, false);

//     await attestationConformité.modifier({
//       identifiantProjet,
//       attestation,
//       dateTransmissionAuCocontractant,
//       preuveTransmissionAuCocontractant,
//       date,
//       utilisateur,
//     });
//   };
//   mediator.register(
//     'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
//     handler,
//   );
// };
