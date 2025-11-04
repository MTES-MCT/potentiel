import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ChangementNomProjetEntity } from '../../changementNomProjet.entity';
import { TypeDocumentLauréat } from '../../..';
import { IdentifiantProjet } from '../../../..';

export type ConsulterChangementNomProjetReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    nomProjet: string;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementNomProjetQuery = Message<
  'Lauréat.Query.ConsulterChangementNomProjet',
  {
    identifiantProjet: string;
    enregistréLe: string;
  },
  Option.Type<ConsulterChangementNomProjetReadModel>
>;

export type ConsulterChangementNomProjetDependencies = {
  find: Find;
};

export const registerConsulterChangementNomProjetQuery = ({
  find,
}: ConsulterChangementNomProjetDependencies) => {
  const handler: MessageHandler<ConsulterChangementNomProjetQuery> = async ({
    identifiantProjet,
    enregistréLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementNomProjet = await find<ChangementNomProjetEntity>(
      `changement-nom-projet|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(demandeChangementNomProjet).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Query.ConsulterChangementNomProjet', handler);
};

export const mapToReadModel = (result: ChangementNomProjetEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    changement: {
      enregistréLe: DateTime.convertirEnValueType(result.changement.enregistréLe),
      enregistréPar: Email.convertirEnValueType(result.changement.enregistréPar),
      nomProjet: result.changement.nomProjet,
      raison: result.changement.raison,
      pièceJustificative: result.changement.pièceJustificative
        ? DocumentProjet.convertirEnValueType(
            result.identifiantProjet,
            TypeDocumentLauréat.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
            result.changement.pièceJustificative?.format,
          )
        : undefined,
    },
  } satisfies ConsulterChangementNomProjetReadModel;
};
