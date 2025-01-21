import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégal } from '../../..';
import { StatutChangementReprésentantLégal, TypeReprésentantLégal } from '../..';

export type ConsulterChangementReprésentantLégalReadModel = {
  identifiantChangement: string;
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    statut: StatutChangementReprésentantLégal.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
    pièceJustificative: DocumentProjet.ValueType;

    accord?: {
      nomReprésentantLégal: string;
      typeReprésentantLégal: TypeReprésentantLégal.ValueType;
      accordéPar: Email.ValueType;
      accordéLe: DateTime.ValueType;
    };

    rejet?: {
      motif: string;
      rejetéPar: Email.ValueType;
      rejetéLe: DateTime.ValueType;
    };
  };
};

export type ConsulterChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
  {
    identifiantChangement: string;
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
    identifiantChangement,
  }) => {
    const changement = await find<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantChangement}`,
    );

    return Option.match(changement)
      .some((changement) =>
        mapToReadModel({
          identifiantProjet: IdentifiantProjet.convertirEnValueType(changement.identifiantProjet),
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
    identifiantChangement,
    demande: { accord, rejet, ...demande },
  },
}) => {
  return {
    identifiantChangement,
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
      demandéLe: DateTime.convertirEnValueType(demande.demandéLe),
      demandéPar: Email.convertirEnValueType(demande.demandéPar),
      accord: accord && {
        nomReprésentantLégal: accord.nomReprésentantLégal,
        typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
          accord.typeReprésentantLégal,
        ),
        accordéPar: Email.convertirEnValueType(accord.accordéPar),
        accordéLe: DateTime.convertirEnValueType(accord.accordéLe),
      },
      rejet: rejet && {
        motif: rejet.motif,
        rejetéPar: Email.convertirEnValueType(rejet.rejetéPar),
        rejetéLe: DateTime.convertirEnValueType(rejet.rejetéLe),
      },
    },
  };
};
