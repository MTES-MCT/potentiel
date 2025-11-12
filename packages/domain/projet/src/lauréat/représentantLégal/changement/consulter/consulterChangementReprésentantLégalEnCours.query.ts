import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ReprésentantLégal } from '../../..';
import {
  StatutChangementReprésentantLégal,
  TypeDocumentChangementReprésentantLégal,
  TypeReprésentantLégal,
} from '../..';
import { DocumentProjet, IdentifiantProjet } from '../../../..';

export type ConsulterChangementReprésentantLégalEnCoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
  statut: StatutChangementReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
};

export type ConsulterChangementReprésentantLégalEnCoursQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterChangementReprésentantLégalEnCoursReadModel>
>;

export type ConsulterChangementReprésentantLégalEnCoursDependencies = {
  find: Find;
};

export const registerConsulterChangementReprésentantLegalEnCoursQuery = ({
  find,
}: ConsulterChangementReprésentantLégalEnCoursDependencies) => {
  const handler: MessageHandler<ConsulterChangementReprésentantLégalEnCoursQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const représentantLégal = await find<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(représentantLégal)
      .some(async ({ demandeEnCours }) => {
        if (!demandeEnCours) {
          return Option.none;
        }

        const changementEnCours = await find<ReprésentantLégal.ChangementReprésentantLégalEntity>(
          `changement-représentant-légal|${identifiantProjetValueType.formatter()}#${demandeEnCours.demandéLe}`,
        );

        return Option.match(changementEnCours)
          .some((changement) =>
            mapToReadModel({
              identifiantProjet: identifiantProjetValueType,
              demande: changement.demande,
            }),
          )
          .none();
      })
      .none();
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
    handler,
  );
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  demande: ReprésentantLégal.ChangementReprésentantLégalEntity['demande'];
}) => ConsulterChangementReprésentantLégalEnCoursReadModel;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, demande }) => {
  return {
    identifiantProjet,
    nomReprésentantLégal: demande.nomReprésentantLégal,
    typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
      demande.typeReprésentantLégal,
    ),
    demandéLe: DateTime.convertirEnValueType(demande.demandéLe),
    demandéPar: Email.convertirEnValueType(demande.demandéPar),
    statut: StatutChangementReprésentantLégal.convertirEnValueType(demande.statut),
    pièceJustificative: DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
      demande.demandéLe,
      demande.pièceJustificative.format,
    ),
  };
};
