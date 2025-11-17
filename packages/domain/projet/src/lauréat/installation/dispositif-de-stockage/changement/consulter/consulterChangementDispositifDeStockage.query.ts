import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { DocumentProjet, IdentifiantProjet } from '../../../../..';
import { DispositifDeStockage, TypeDocumentDispositifDeStockage } from '../../..';
import { ChangementDispositifDeStockageEntity } from '../changementDispositifDeStockage.entity';

export type ConsulterChangementDispositifDeStockageReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    dispositifDeStockage: DispositifDeStockage.ValueType;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementDispositifDeStockageQuery = Message<
  'Lauréat.Installation.Query.ConsulterChangementDispositifDeStockage',
  {
    identifiantProjet: string;
    enregistréLe: string;
  },
  Option.Type<ConsulterChangementDispositifDeStockageReadModel>
>;

export type ConsulterChangementDispositifDeStockageDependencies = {
  find: Find;
};

export const registerConsulterChangementDispositifDeStockageQuery = ({
  find,
}: ConsulterChangementDispositifDeStockageDependencies) => {
  const handler: MessageHandler<ConsulterChangementDispositifDeStockageQuery> = async ({
    identifiantProjet,
    enregistréLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const changementDispositifDeStockage = await find<ChangementDispositifDeStockageEntity>(
      `changement-dispositif-de-stockage|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(changementDispositifDeStockage).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterChangementDispositifDeStockage', handler);
};

export const mapToReadModel = (result: ChangementDispositifDeStockageEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    changement: {
      enregistréLe: DateTime.convertirEnValueType(result.changement.enregistréLe),
      enregistréPar: Email.convertirEnValueType(result.changement.enregistréPar),
      dispositifDeStockage: DispositifDeStockage.convertirEnValueType(
        result.changement.dispositifDeStockage,
      ),
      raison: result.changement.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentDispositifDeStockage.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
        result.changement.pièceJustificative?.format,
      ),
    },
  } satisfies ConsulterChangementDispositifDeStockageReadModel;
};
