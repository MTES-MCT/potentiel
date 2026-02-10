import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ChangementInstallateurEntity } from '../changementInstallateur.entity.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../../index.js';
import { TypeDocumentInstallateur } from '../../../index.js';

export type ConsulterChangementInstallateurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    installateur: string;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementInstallateurQuery = Message<
  'Lauréat.Installateur.Query.ConsulterChangementInstallateur',
  {
    identifiantProjet: string;
    enregistréLe: string;
  },
  Option.Type<ConsulterChangementInstallateurReadModel>
>;

export type ConsulterChangementInstallateurDependencies = {
  find: Find;
};

export const registerConsulterChangementInstallateurQuery = ({
  find,
}: ConsulterChangementInstallateurDependencies) => {
  const handler: MessageHandler<ConsulterChangementInstallateurQuery> = async ({
    identifiantProjet,
    enregistréLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const changementInstallateur = await find<ChangementInstallateurEntity>(
      `changement-installateur|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(changementInstallateur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installateur.Query.ConsulterChangementInstallateur', handler);
};

export const mapToReadModel = (result: ChangementInstallateurEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    changement: {
      enregistréLe: DateTime.convertirEnValueType(result.changement.enregistréLe),
      enregistréPar: Email.convertirEnValueType(result.changement.enregistréPar),
      installateur: result.changement.installateur,
      raison: result.changement.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentInstallateur.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
        result.changement.pièceJustificative?.format,
      ),
    },
  } satisfies ConsulterChangementInstallateurReadModel;
};
