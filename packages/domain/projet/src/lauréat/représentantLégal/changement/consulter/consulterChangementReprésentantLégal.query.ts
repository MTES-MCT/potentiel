import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ReprésentantLégal } from '../../..';
import { StatutChangementReprésentantLégal, TypeReprésentantLégal } from '../..';
import { DocumentProjet } from '../../../..';

export type ConsulterChangementReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    statut: StatutChangementReprésentantLégal.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    demandéeLe: DateTime.ValueType;
    demandéePar: Email.ValueType;
    pièceJustificative: DocumentProjet.ValueType;

    accord?: {
      nomReprésentantLégal: string;
      typeReprésentantLégal: TypeReprésentantLégal.ValueType;
      accordéePar: Email.ValueType;
      accordéeLe: DateTime.ValueType;
    };

    rejet?: {
      motif: string;
      rejetéePar: Email.ValueType;
      rejetéeLe: DateTime.ValueType;
    };
  };
};

export type ConsulterChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
  {
    identifiantProjet: string;
    demandéLe: string;
  },
  Option.Type<ConsulterChangementReprésentantLégalReadModel>
>;

export type ConsulterChangementReprésentantLégalDependencies = {
  find: Find;
};

export const registerConsulterChangementReprésentantLegalQuery = ({
  find,
}: ConsulterChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ConsulterChangementReprésentantLégalQuery> = async ({
    identifiantProjet,
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const changement = await find<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjetValueType.formatter()}#${demandéLe}`,
    );

    return Option.match(changement)
      .some((changement) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          changement,
        }),
      )
      .none();
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
    handler,
  );
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  changement: ReprésentantLégal.ChangementReprésentantLégalEntity;
}) => ConsulterChangementReprésentantLégalReadModel;

const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  changement: {
    demande: { accord, rejet, ...demande },
  },
}) => {
  return {
    identifiantProjet,
    demande: {
      statut: ReprésentantLégal.StatutChangementReprésentantLégal.convertirEnValueType(
        demande.statut,
      ),
      nomReprésentantLégal: demande.nomReprésentantLégal,
      typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
        demande.typeReprésentantLégal,
      ),
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
        demande.demandéLe,
        demande.pièceJustificative.format,
      ),
      demandéeLe: DateTime.convertirEnValueType(demande.demandéLe),
      demandéePar: Email.convertirEnValueType(demande.demandéPar),
      accord: accord && {
        nomReprésentantLégal: accord.nomReprésentantLégal,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          accord.typeReprésentantLégal,
        ),
        accordéePar: Email.convertirEnValueType(accord.accordéPar),
        accordéeLe: DateTime.convertirEnValueType(accord.accordéLe),
      },
      rejet: rejet && {
        motif: rejet.motif,
        rejetéePar: Email.convertirEnValueType(rejet.rejetéPar),
        rejetéeLe: DateTime.convertirEnValueType(rejet.rejetéLe),
      },
    },
  };
};
