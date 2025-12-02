import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { StatutPreuveRecandidature } from '..';
import { AbandonEntity } from '../abandon.entity';
import { IdentifiantProjet } from '../../..';

export type ConsulterAbandonReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  demandéLe: DateTime.ValueType;
  demandeEnCours: boolean;
  estAbandonné: boolean;
  accordéLe?: DateTime.ValueType;

  estUneRecandidature: boolean;
  recandidature?: {
    statut: StatutPreuveRecandidature.ValueType;
    preuve?: {
      demandéeLe: DateTime.ValueType;
      identifiantProjet?: IdentifiantProjet.ValueType;
      transmiseLe?: DateTime.ValueType;
      transmisePar?: Email.ValueType;
    };
  };
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
    estUneRecandidature: !!result.recandidature,
    recandidature: result.recandidature
      ? {
          statut: StatutPreuveRecandidature.convertirEnValueType(result.recandidature.statut),
          preuve: result.recandidature.preuve
            ? {
                demandéeLe: DateTime.convertirEnValueType(result.recandidature.preuve.demandéeLe),
                transmiseLe: result.recandidature.preuve.transmiseLe
                  ? DateTime.convertirEnValueType(result.recandidature.preuve.transmiseLe)
                  : undefined,
                transmisePar: result.recandidature.preuve.transmisePar
                  ? Email.convertirEnValueType(result.recandidature.preuve.transmisePar)
                  : undefined,
                identifiantProjet: result.recandidature.preuve.identifiantProjet
                  ? IdentifiantProjet.convertirEnValueType(
                      result.recandidature.preuve.identifiantProjet,
                    )
                  : undefined,
              }
            : undefined,
        }
      : undefined,
  } satisfies ConsulterAbandonReadModel;
};
