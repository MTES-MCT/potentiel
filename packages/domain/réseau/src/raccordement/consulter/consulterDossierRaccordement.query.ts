import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { Find } from '@potentiel-libraries/projection';
import { DossierRaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../dossierRaccordementNonRéférencé.error';
import { DocumentProjet } from '@potentiel-domain/document';

export type ConsulterDossierRaccordementReadModel = {
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
};

export type ConsulterDossierRaccordementQuery = Message<
  'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordement: string;
  },
  ConsulterDossierRaccordementReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  find: Find;
};

export const registerConsulterDossierRaccordementQuery = ({
  find,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterDossierRaccordementQuery> = async ({
    identifiantProjetValue,
    référenceDossierRaccordement,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référence = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordement,
    );

    const result = await find<DossierRaccordementEntity>(
      `dossier-raccordement|${identifiantProjet.formatter()}#${référenceDossierRaccordement}`,
    );

    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    return mapToResult(identifiantProjet, référence, result);
  };

  mediator.register('CONSULTER_DOSSIER_RACCORDEMENT_QUERY', handler);
};

const mapToResult = (
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: RéférenceDossierRaccordement.ValueType,
  {
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  }: DossierRaccordementEntity,
): ConsulterDossierRaccordementReadModel => {
  return {
    référence,
    demandeComplèteRaccordement: {
      dateQualification: demandeComplèteRaccordement.dateQualification
        ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
        : undefined,
      accuséRéception: demandeComplèteRaccordement.accuséRéception
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
              référence.formatter(),
            ).formatter(),
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
            identifiantProjet.formatter(),
            TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
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
