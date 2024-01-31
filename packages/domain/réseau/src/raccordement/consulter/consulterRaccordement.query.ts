import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { Find } from '@potentiel-libraries/projection';
import { RaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { GestionnaireRéseau } from '../..';

export type ConsulterRaccordementReadModel = {
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

export type ConsulterRaccordementQuery = Message<
  'CONSULTER_RACCORDEMENT_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterRaccordementReadModel
>;

export type ConsulterRaccordementDependencies = {
  find: Find;
};

export const registerConsulterRaccordementQuery = ({ find }: ConsulterRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterRaccordementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<RaccordementEntity>(`raccordement|${identifiantProjet.formatter()}`);

    if (isNone(result)) {
      return {
        identifiantProjet,
        identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
        dossiers: [],
      };
    }

    return mapToReadModel(result);
  };

  mediator.register('CONSULTER_RACCORDEMENT_QUERY', handler);
};

const mapToReadModel = (entity: RaccordementEntity): ConsulterRaccordementReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
      entity.identifiantGestionnaireRéseau,
    ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    dossiers: entity.dossiers.map(
      ({
        demandeComplèteRaccordement,
        misÀJourLe,
        référence,
        miseEnService,
        propositionTechniqueEtFinancière,
      }) => ({
        référence: RéférenceDossierRaccordement.convertirEnValueType(référence),
        demandeComplèteRaccordement: {
          dateQualification: demandeComplèteRaccordement?.dateQualification
            ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
            : undefined,
          accuséRéception: demandeComplèteRaccordement?.accuséRéception
            ? DocumentProjet.convertirEnValueType(
                entity.identifiantProjet,
                TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(référence).formatter(),
                demandeComplèteRaccordement.dateQualification || '',
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
                entity.identifiantProjet,
                TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(référence).formatter(),
                propositionTechniqueEtFinancière.dateSignature,
                propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée?.format ||
                  '',
              ),
            }
          : undefined,
        miseEnService: miseEnService
          ? {
              dateMiseEnService: DateTime.convertirEnValueType(miseEnService.dateMiseEnService),
            }
          : undefined,
        misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
      }),
    ),
  };
};
