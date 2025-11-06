import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ChangementNomProjetEntity } from '../changementNomProjet.entity';
import { IdentifiantProjet } from '../../../..';
import { TypeDocumentNomProjet } from '../../..';

export type ConsulterChangementNomProjetReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    nomProjet: string;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
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

    const changementNomProjet = await find<ChangementNomProjetEntity>(
      `changement-nom-projet|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(changementNomProjet).some(mapToReadModel).none();
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
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentNomProjet.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
        result.changement.pièceJustificative.format,
      ),
    },
  } satisfies ConsulterChangementNomProjetReadModel;
};
