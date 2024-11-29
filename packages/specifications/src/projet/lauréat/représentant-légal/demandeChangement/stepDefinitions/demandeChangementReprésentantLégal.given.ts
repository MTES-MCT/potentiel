// import { Given as EtantDonné } from '@cucumber/cucumber';
// import { mediator } from 'mediateur';

// import { ReprésentantLégal } from '@potentiel-domain/laureat';
// import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

// import { PotentielWorld } from '../../../../potentiel.world';

// EtantDonné(
//   /une demande de changement de représentant légal en cours pour le projet lauréat/,
//   async function (this: PotentielWorld) {
//     await créerDemandeChangementReprésentantLégal.call(this);
//   },
// );

// export async function créerDemandeChangementReprésentantLégal(this: PotentielWorld) {
//   const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

//   const { raison, demandéLe, demandéPar, pièceJustificative, recandidature } =
//     this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégal.créer({
//       identifiantProjet,
//     });

//   /*
//     identifiantProjetValue: string;
//     nomReprésentantLégalValue: string;
//     typeReprésentantLégalValue: string;
//     piècesJustificativeValue: Array<{
//       content: ReadableStream;
//       format: string;
//     }>;
//     identifiantUtilisateurValue: string;
//     dateDemandeValue: string;

// */

//   await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
//     type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
//     data: {
//       identifiantProjetValue: identifiantProjet,
//     },
//   });

//   await mediator.send<ReprésentantLégal.ReprésentantLégalCommand>({
//     type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
//     data: {
//       identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
//       importéLe: DateTime.convertirEnValueType(importéLe),
//       importéPar: Email.system(),
//     },
//   });
// }
