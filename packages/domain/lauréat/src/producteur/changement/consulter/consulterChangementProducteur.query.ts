import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ChangementProducteurEntity, TypeDocumentProducteur } from '../..';

export type ConsulterChangementProducteurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    nouveauProducteur: string;
    raison?: string;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementProducteurQuery = Message<
  'Lauréat.Producteur.Query.ConsulterChangementProducteur',
  {
    identifiantProjet: string;
    demandéLe: string;
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
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementProducteur = await find<ChangementProducteurEntity>(
      `changement-producteur|${identifiantProjetValueType.formatter()}#${demandéLe}`,
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

    demande: {
      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      nouveauProducteur: result.demande.nouveauProducteur,
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentProducteur.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
        result.demande.pièceJustificative?.format,
      ),
    },
  } satisfies ConsulterChangementProducteurReadModel;
};
