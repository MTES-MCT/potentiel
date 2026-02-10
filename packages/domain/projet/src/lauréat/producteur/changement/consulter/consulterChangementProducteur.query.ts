import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { TypeDocumentProducteur } from '../../index.js';
import { ChangementProducteurEntity } from '../changementProducteur.entity.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterChangementProducteurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    ancienProducteur: string;
    nouveauProducteur: string;
    raison?: string;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementProducteurQuery = Message<
  'Lauréat.Producteur.Query.ConsulterChangementProducteur',
  {
    identifiantProjet: string;
    enregistréLe: string;
  },
  Option.Type<ConsulterChangementProducteurReadModel>
>;

export type ConsulterChangementProducteurDependencies = {
  find: Find;
};

export const registerConsulterChangementProducteurQuery = ({
  find,
}: ConsulterChangementProducteurDependencies) => {
  const handler: MessageHandler<ConsulterChangementProducteurQuery> = async ({
    identifiantProjet,
    enregistréLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementProducteur = await find<ChangementProducteurEntity>(
      `changement-producteur|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(demandeChangementProducteur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Producteur.Query.ConsulterChangementProducteur', handler);
};

export const mapToReadModel = (result: ChangementProducteurEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    changement: {
      enregistréLe: DateTime.convertirEnValueType(result.changement.enregistréLe),
      enregistréPar: Email.convertirEnValueType(result.changement.enregistréPar),
      ancienProducteur: result.changement.ancienProducteur,
      nouveauProducteur: result.changement.nouveauProducteur,
      raison: result.changement.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentProducteur.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
        result.changement.pièceJustificative?.format,
      ),
    },
  } satisfies ConsulterChangementProducteurReadModel;
};
