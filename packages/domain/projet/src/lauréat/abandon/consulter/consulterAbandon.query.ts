import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { AbandonEntity } from '../abandon.entity';
import { IdentifiantProjet } from '../../..';

export type ConsulterAbandonReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  demandéLe: DateTime.ValueType;
  demandeEnCours: boolean;
  estAbandonné: boolean;
  accordéLe?: DateTime.ValueType;
};

export type ConsulterAbandonQuery = Message<
  'Lauréat.Abandon.Query.ConsulterAbandon',
  {
    identifiantProjetValue: string;
    autoritéCompétente?: string;
  },
  Option.Type<ConsulterAbandonReadModel>
>;

export type ConsulterAbandonDependencies = {
  find: Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<AbandonEntity>(`abandon|${identifiantProjet.formatter()}`);

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Abandon.Query.ConsulterAbandon', handler);
};

const mapToReadModel = (result: AbandonEntity) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    demandeEnCours: result.demandeEnCours,
    estAbandonné: result.estAbandonné,
    accordéLe: result.accordéLe && DateTime.convertirEnValueType(result.accordéLe),
    demandéLe: DateTime.convertirEnValueType(result.demandéLe),
  } satisfies ConsulterAbandonReadModel;
};
