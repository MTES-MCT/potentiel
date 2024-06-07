import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';

import { ListV2 } from '@potentiel-domain/core';
import {
  ConsulterMainLevéeGarantiesFinancièresReadModel,
  MainLevéeGarantiesFinancièresEntity,
  MotifDemandeMainLevéeGarantiesFinancières,
  StatutMainLevéeGarantiesFinancières,
} from '../..';

export type ListerMainLevéeGarantiesFinancièresReadModel =
  ConsulterMainLevéeGarantiesFinancièresReadModel[];

export type ListerMainLevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Query.Lister',
  {
    identifiantProjetValue: string;
    région?: string;
  },
  Option.Type<ConsulterMainLevéeGarantiesFinancièresReadModel>
>;

export type ConsulterMainLevéeGarantiesFinancièresDependencies = {
  listV2: ListV2;
};

// /**
//  * @todo on devrait passer uniquement la région dans la query et pas les infos utilisateur pour le déterminer
//  */
// if (rôle === Role.dreal.nom) {
//   const régionDreal = await récupérerRégionDreal(email);
//   if (Option.isNone(régionDreal)) {
//     throw new CommonError.RégionNonTrouvéeError();
//   }

//   région = régionDreal.région;
// }

export const registerConsulterMainLevéeGarantiesFinancièresQuery = ({
  listV2,
}: ListerMainLevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerMainLevéeGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
    région,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<MainLevéeGarantiesFinancièresEntity>(
      `main-levee-garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel({ ...result, identifiantProjetValueType: identifiantProjet });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Query.Consulter', handler);
};

const mapToReadModel = ({
  motif,
  demande,
  dernièreMiseÀJour,
  statut,
  identifiantProjetValueType,
}: MainLevéeGarantiesFinancièresEntity & {
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterMainLevéeGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  demande: {
    demandéeLe: DateTime.convertirEnValueType(demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(demande.demandéePar),
  },
  motif: MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motif),
  statut: StatutMainLevéeGarantiesFinancières.convertirEnValueType(statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(dernièreMiseÀJour.par),
  },
});
