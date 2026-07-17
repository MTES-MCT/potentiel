import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { type List, Where } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import type { DocumentProjet } from '#document-projet';
import type { Raccordement } from '../../../index.js';
import type {
  DocumentRaccordementSubEntity,
  DossierRaccordementEntity,
} from '../../dossierRaccordement.entity.js';
import { DocumentRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type ConsulterDocumentReadModel = {
  type: TypeDocumentsRaccordement.ValueType;
  dateSignature: DateTime.ValueType;
  document: DocumentProjet.ValueType;
};

export type ConsulterDocumentQuery = Message<
  'Lauréat.Raccordement.Query.ConsulterDocument',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementValue: string;
    typeDocumentValue: TypeDocumentsRaccordement.RawType;
  },
  Option.Type<ConsulterDocumentReadModel>
>;

export type ConsulterDocumentDependencies = {
  list: List;
};

export const registerConsulterDocumentQuery = ({ list }: ConsulterDocumentDependencies) => {
  const handler: MessageHandler<ConsulterDocumentQuery> = async ({
    identifiantProjetValue,
    référenceDossierRaccordementValue: référenceDossierRaccordement,
    typeDocumentValue: typeDocument,
  }) => {
    const key = TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(typeDocument);

    const result = await list<DossierRaccordementEntity, Raccordement.RaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjetValue),
          référence: Where.equal(référenceDossierRaccordement),
          [key]: { dateSignature: Where.notEqualNull() },
        },
        join: {
          entity: 'raccordement',
          on: 'identifiantProjet',
          where: { désactivé: Where.equalNull() },
        },
      },
    );

    if (!result.items.length || !result.items[0][key]) {
      return Option.none;
    }

    return mapToReadModel({
      dateSignature: result.items[0][key].dateSignature,
      document: result.items[0][key].document,
      typeDocument,
      identifiantProjet: identifiantProjetValue,
      référence: référenceDossierRaccordement,
    });
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterDocument', handler);
};

export const mapToReadModel = ({
  dateSignature,
  document,
  typeDocument,
  identifiantProjet,
  référence,
}: DocumentRaccordementSubEntity & {
  typeDocument: TypeDocumentsRaccordement.RawType;
  identifiantProjet: string;
  référence: string;
}): ConsulterDocumentReadModel => {
  return {
    document: DocumentRaccordement.documentRaccordement(typeDocument)({
      identifiantProjet,
      référenceDossierRaccordement: référence,
      dateSignature,
      document,
    }),
    dateSignature: DateTime.convertirEnValueType(dateSignature),
    type: TypeDocumentsRaccordement.convertirEnValueType(typeDocument),
  };
};
