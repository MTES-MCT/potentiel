// import { IdentifiantProjet } from '@potentiel-domain/common';
// import { DomainEvent } from '@potentiel-domain/core';
// import { Option } from '@potentiel-libraries/monads';
// import * as ContactEmailGestionnaireRéseau from '../contactEmailGestionnaireRéseau.valueType';
// import { GestionnaireRéseauDéjàExistantError } from '../gestionnaireRéseauDéjàExistant.error';
// import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
// import { RaccordementAggregate } from '../../raccordement/raccordement.aggregate';

// export type GestionnaireRéseauAttribuéAUnProjetEvent = DomainEvent<
//   'GestionnaireRéseauAttribuéAUnProjet-V1',
//   {
//     identifiantGestionnaireRéseauValue: string;
//     projet: {
//       identifiantProjetValue: string;
//       nomProjetValue: string;
//       appelOffreValue: string;
//       périodeValue: string;
//       familleValue: string;
//       numéroCREValue: string;
//     };
//     isValidatedByPorteurValue: boolean;
//   }
// >;

// export type AttribuerOptions = {
//   identifiantGestionnaireRéseauValue: IdentifiantGestionnaireRéseau.ValueType;
//   projet: {
//     identifiantProjetValue: IdentifiantProjet.ValueType;
//     nomProjetValue: string;
//     appelOffreValue: string;
//     périodeValue: string;
//     familleValue: string;
//     numéroCREValue: string;
//   };
//   isValidatedByPorteurValue: boolean;
// };

// export async function attribuer(
//   this: RaccordementAggregate,
//   { identifiantGestionnaireRéseauValue, projet, isValidatedByPorteurValue }: AttribuerOptions,
// ) {
//   if (!this.identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
//     throw new GestionnaireRéseauDéjàExistantError();
//   }

//   const event: AttribuerGestionnaireRéseauAUnProjetEvent = {
//     type: 'GestionnaireRéseauAttribuéAUnProjet-V1',
//     payload: {
//       codeEIC: identifiantGestionnaireRéseau.formatter(),
//       raisonSociale,
//       aideSaisieRéférenceDossierRaccordement: {
//         format,
//         légende,
//         expressionReguliere: expressionReguliere.formatter(),
//       },
//       contactEmail: Option.isNone(contactEmail)
//         ? ContactEmailGestionnaireRéseau.defaultValue.email
//         : contactEmail.formatter(),
//     },
//   };

//   await this.publish(event);
// }

// // export function applyGestionnaireRéseauAjouté(
// //   this: GestionnaireRéseauAggregate,
// //   {
// //     payload: {
// //       codeEIC,
// //       aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
// //     },
// //   }: GestionnaireRéseauAjoutéEvent,
// // ) {
// //   this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
// //   this.référenceDossierRaccordementExpressionRegulière = !expressionReguliere
// //     ? ExpressionRegulière.accepteTout
// //     : ExpressionRegulière.convertirEnValueType(expressionReguliere);
// // }
