import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { Find } from '@potentiel-libraries/projection';
import { RaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../dossierRaccordementNonRéférencé.error';
import { DocumentProjet } from '@potentiel-domain/document';

export type ListerDossierRaccordementReadModel = Array<{
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
}>;

export type ListerDossierRaccordementQuery = Message<
  'LISTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjetValue: string;
  },
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementDependencies = {
  find: Find;
};

export const registerListerDossierRaccordementQuery = ({
  find,
}: ListerDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<RaccordementEntity>(`raccordement|${identifiantProjet.formatter()}`);

    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    return result.dossiers.map((dossier) => mapToReadModel(identifiantProjet, dossier));
  };

  mediator.register('LISTER_DOSSIER_RACCORDEMENT_QUERY', handler);
};

const mapToReadModel = (
  identifiantProjet: IdentifiantProjet.ValueType,
  {
    référence,
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  }: RaccordementEntity['dossiers'][number],
): ListerDossierRaccordementReadModel[number] => {
  const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(référence);
  return {
    référence: référenceDossierRaccordement,
    demandeComplèteRaccordement: {
      dateQualification: demandeComplèteRaccordement?.dateQualification
        ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
        : undefined,
      accuséRéception: demandeComplèteRaccordement?.accuséRéception
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
              référenceDossierRaccordement.formatter(),
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
              référenceDossierRaccordement.formatter(),
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
