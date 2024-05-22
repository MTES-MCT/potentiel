import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { ListV2 } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '@potentiel-domain/document';
import {
  DossierRaccordementEntity,
  RéférenceDossierRaccordement,
  TypeDocumentRaccordement,
} from '..';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type DossierRaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  dossiers: Array<{
    référence: RéférenceDossierRaccordement.ValueType;
    demandeComplèteRaccordement: {
      dateQualification?: DateTime.ValueType;
      accuséRéception?: DocumentProjet.ValueType;
    };
    propositionTechniqueEtFinancière?: {
      dateSignature: DateTime.ValueType;
      propositionTechniqueEtFinancièreSignée: DocumentProjet.ValueType;
    };
    miseEnService?: {
      dateMiseEnService?: DateTime.ValueType;
    };
    misÀJourLe: DateTime.ValueType;
  }>;
};

export type ListerDossierRaccordementReadModel = {
  items: ReadonlyArray<DossierRaccordementReadModel>;
  total: number;
};

export type ListerDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ListerDossierRaccordement',
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementQueryDependencies = {
  listV2: ListV2;
};

export const registerListerDossierRaccordementQuery = ({
  listV2: list,
}: ListerDossierRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementQuery> = async () => {
    const { items, total } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      orderBy: {
        référence: 'ascending',
      },
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      total,
    };
  };
  mediator.register('Réseau.Raccordement.Query.ListerDossierRaccordement', handler);
};

// copier coller from consulterDossierRaccordement
const mapToReadModel = (
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: RéférenceDossierRaccordement.ValueType,
  {
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  }: DossierRaccordementEntity,
): DossierRaccordementReadModel => {
  return {
    référence,
    demandeComplèteRaccordement: {
      dateQualification: demandeComplèteRaccordement?.dateQualification
        ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
        : undefined,
      accuséRéception: demandeComplèteRaccordement?.accuséRéception
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
              référence.formatter(),
            ).formatter(),
            demandeComplèteRaccordement.dateQualification || '2020-02-17T00:00:00.000Z',
            demandeComplèteRaccordement.accuséRéception.format,
          )
        : undefined,
    },
    propositionTechniqueEtFinancière: propositionTechniqueEtFinancière
      ? {
          dateSignature: DateTime.convertirEnValueType(
            propositionTechniqueEtFinancière.dateSignature,
          ),
          propositionTechniqueEtFinancièreSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
              référence.formatter(),
            ).formatter(),
            propositionTechniqueEtFinancière.dateSignature,
            propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée?.format || '',
          ),
        }
      : undefined,
    miseEnService: miseEnService
      ? {
          dateMiseEnService: DateTime.convertirEnValueType(miseEnService.dateMiseEnService),
        }
      : undefined,
  };
};
