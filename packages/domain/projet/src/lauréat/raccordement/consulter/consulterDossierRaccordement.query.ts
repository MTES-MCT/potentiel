import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { DossierRaccordementEntity } from '../raccordement.entity';
import { DocumentProjet, IdentifiantProjet } from '../../..';

export type ConsulterDossierRaccordementReadModel = {
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
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
  'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementValue: string;
  },
  Option.Type<ConsulterDossierRaccordementReadModel>
>;

export type ConsulterDossierRaccordementDependencies = {
  find: Find;
};

export const registerConsulterDossierRaccordementQuery = ({
  find,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterDossierRaccordementQuery> = async ({
    identifiantProjetValue,
    référenceDossierRaccordementValue: référenceDossierRaccordement,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référence = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordement,
    );

    const result = await find<DossierRaccordementEntity>(
      `dossier-raccordement|${identifiantProjet.formatter()}#${référenceDossierRaccordement}`,
    );

    if (Option.isNone(result)) {
      return result;
    }

    return mapToResult(identifiantProjet, référence, result);
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterDossierRaccordement', handler);
};

const mapToResult = (
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: RéférenceDossierRaccordement.ValueType,
  {
    identifiantGestionnaireRéseau,
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  }: DossierRaccordementEntity,
): ConsulterDossierRaccordementReadModel => {
  return {
    identifiantProjet,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
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
            // Initialement dans le legacy certaines DCR n'avait pas de date de qualitification.
            // Lorsque le domain raccordement a été migré, l'optionalité de la date a été conservé.
            // Par la suite, le domain Document a été introduit pour harmoniser la gestion des documents
            // Ce module s'appuie sur des dates pour les noms de fichier
            // Dans le cas de la DCR étant donnée que les date ne sont pas toujours présentes, une date par défaut au 1er commit du projet
            // A été mise en place. Les fichiers correspondant dans le bucket ont la même date aussi.
            // Au moment de l'introduction de ce changement (2024-02-08), il y avait 946 DCR ayant le soucis.
            // Pour corriger le probléme définitivement il faudrait mettre la date de qualitification contenu dans le fichier,
            // Mais étant donnée que le legacy n'avait pas de retriction au niveau du format de fichier, il est compliqué d'extraire automatiquement cette information
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
