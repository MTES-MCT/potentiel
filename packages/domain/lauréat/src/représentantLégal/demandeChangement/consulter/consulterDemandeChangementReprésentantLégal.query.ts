import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ReprésentantLégal } from '../../..';
import { StatutDemandeChangementReprésentantLégal, TypeReprésentantLégal } from '../..';

export type ConsulterDemandeChangementReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutDemandeChangementReprésentantLégal.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
};

export type ConsulterDemandeChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterDemandeChangementReprésentantLégal',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDemandeChangementReprésentantLégalReadModel>
>;

export type ConsulterDemandeChangementReprésentantLégalDependencies = {
  find: Find;
};

export const registerConsulterDemandeChangementReprésentantLegalQuery = ({
  find,
}: ConsulterDemandeChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ConsulterDemandeChangementReprésentantLégalQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demande = await find<ReprésentantLégal.DemandeChangementReprésentantLégalEntity>(
      `demande-changement-représentant-légal|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demande)
      .some((demande) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          demande,
        }),
      )
      .none();
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Query.ConsulterDemandeChangementReprésentantLégal',
    handler,
  );
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  demande: ReprésentantLégal.DemandeChangementReprésentantLégalEntity;
}) => Option.Type<ConsulterDemandeChangementReprésentantLégalReadModel>;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, demande }) => ({
  identifiantProjet,
  statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.convertirEnValueType(
    demande.statut,
  ),
  nomReprésentantLégal: demande.nomReprésentantLégal,
  typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(demande.typeReprésentantLégal),
  pièceJustificative: DocumentProjet.convertirEnValueType(
    identifiantProjet.formatter(),
    ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
    demande.demandéLe,
    demande.pièceJustificative.format,
  ),
  demandéLe: DateTime.convertirEnValueType(demande.demandéLe),
  demandéPar: Email.convertirEnValueType(demande.demandéPar),
});
