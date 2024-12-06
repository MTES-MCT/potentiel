import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { Lauréat, ReprésentantLégal } from '../..';
import { StatutDemandeChangementReprésentantLégal, TypeReprésentantLégal } from '..';

export type ConsulterReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  demande?: {
    statut: StatutDemandeChangementReprésentantLégal.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterReprésentantLégalReadModel>
>;

export type ConsulterReprésentantLégalDependencies = {
  find: Find;
};

export const registerConsulterRepresentantLegalQuery = ({
  find,
}: ConsulterReprésentantLégalDependencies) => {
  const handler: MessageHandler<ConsulterReprésentantLégalQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const lauréat = await find<Lauréat.LauréatEntity>(
      `lauréat|${identifiantProjetValueType.formatter()}`,
    );

    const demandeChangement =
      await find<ReprésentantLégal.DemandeChangementReprésentantLégalEntity>(
        `demande-changement-représentant-légal|${identifiantProjetValueType.formatter()}`,
      );

    return Option.match(lauréat)
      .some((lauréat) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          représentantLégal: lauréat.représentantLégal,
          demandeChangement: Option.isSome(demandeChangement) ? demandeChangement : undefined,
        }),
      )
      .none();
  };
  mediator.register('Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  représentantLégal: Lauréat.LauréatEntity['représentantLégal'];
  demandeChangement?: ReprésentantLégal.DemandeChangementReprésentantLégalEntity;
}) => Option.Type<ConsulterReprésentantLégalReadModel>;

const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  représentantLégal,
  demandeChangement,
}) => {
  if (!représentantLégal) {
    return Option.none;
  }

  return {
    identifiantProjet,
    nomReprésentantLégal: représentantLégal.nom,
    typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(représentantLégal.type),
    demande: demandeChangement
      ? {
          statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.convertirEnValueType(
            demandeChangement.statut,
          ),
          nomReprésentantLégal: demandeChangement.nomReprésentantLégal,
          typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
            demandeChangement.typeReprésentantLégal,
          ),
          pièceJustificative: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
            demandeChangement.demandéLe,
            demandeChangement.pièceJustificative.format,
          ),
          demandéLe: DateTime.convertirEnValueType(demandeChangement.demandéLe),
          demandéPar: Email.convertirEnValueType(demandeChangement.demandéPar),
        }
      : undefined,
  };
};
