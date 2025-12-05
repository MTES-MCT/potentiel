import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { AbandonEntity } from '../abandon.entity';
import { IdentifiantProjet } from '../../..';
import { DemandeAbandonEntity, StatutAbandon } from '..';

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

    if (Option.isNone(result)) {
      return Option.none;
    }

    if (result.estAbandonné) {
      const détail = await find<DemandeAbandonEntity>(
        `demande-abandon|${identifiantProjet.formatter()}#${result.dernièreDemande.date}`,
      );
      return Option.match(détail)
        .some((détail) =>
          mapToReadModel({ ...result, accordéLe: détail.demande.accord?.accordéLe }),
        )
        .none();
    }

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Abandon.Query.ConsulterAbandon', handler);
};

const mapToReadModel = (
  result: AbandonEntity & { readonly accordéLe?: string },
): ConsulterAbandonReadModel => {
  const statutAbandon = StatutAbandon.convertirEnValueType(result.dernièreDemande.statut);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    demandeEnCours: statutAbandon.estEnCours(),
    estAbandonné: result.estAbandonné,
    demandéLe: DateTime.convertirEnValueType(result.dernièreDemande.date),
    accordéLe: result.accordéLe ? DateTime.convertirEnValueType(result.accordéLe) : undefined,
  };
};
