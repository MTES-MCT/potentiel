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
import { DemanderMainLevéeGarantiesFinancièresCommand } from '../demander/demanderMainLevéeGarantiesFinancières.command';

export type ListerDemandeMainLevéeGarantiesFinancièresReadModel =
  ConsulterMainLevéeGarantiesFinancièresReadModel[];

export type ListerDemandeMainLevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Query.Lister',
  {
    identifiantProjetValue: string;
    région?: string;
  },
  ListerDemandeMainLevéeGarantiesFinancièresReadModel
>;

export type ListerDemandeMainLevéeGarantiesFinancièresDependencies = {
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
}: ListerDemandeMainLevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerDemandeMainLevéeGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
    région,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const {
      items,
      range: { startPosition, endPosition },
      total,
    } = await listV2<DemanderMainLevéeGarantiesFinancièresCommand>(
      'depot-en-cours-garanties-financieres',
      {
        orderBy: { dépôt: { dernièreMiseÀJour: { date: 'descending' } } },
        where: {
          ...(région && {
            région: { operator: 'equal', value: appelOffre },
          }),
          ...(région && {
            régionProjet: { operator: 'equal', value: région },
          }),
          ...(cycle && {
            appelOffre: { operator: cycle === 'PPE2' ? 'like' : 'notLike', value: '%PPE2%' },
          }),
        },
      },
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
