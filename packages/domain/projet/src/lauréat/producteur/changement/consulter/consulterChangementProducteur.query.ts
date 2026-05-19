import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { DocumentProducteur } from '../../index.js';
import type { ChangementProducteurEntity } from '../changementProducteur.entity.js';

export type ConsulterChangementProducteurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    ancien: {
      producteur: string;
      siret?: string;
    };
    nouveau: {
      producteur: string;
      siret?: string;
    };
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
      ancien: {
        producteur: result.changement.ancien.producteur,
        siret: result.changement.ancien.numéroIdentification?.siret,
      },
      nouveau: {
        producteur: result.changement.nouveau.producteur,
        siret: result.changement.nouveau.numéroIdentification?.siret,
      },
      raison: result.changement.raison,
      pièceJustificative: DocumentProducteur.pièceJustificative({
        identifiantProjet: result.identifiantProjet,
        ...result.changement,
      }),
    },
  } satisfies ConsulterChangementProducteurReadModel;
};
