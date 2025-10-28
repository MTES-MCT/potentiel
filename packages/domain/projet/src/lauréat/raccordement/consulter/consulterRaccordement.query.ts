import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { RaccordementEntity } from '../raccordement.entity';
import { IdentifiantProjet } from '../../..';

export type ConsulterRaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau?: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
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
    miseÀJourLe: DateTime.ValueType;
  }>;
};

export type ConsulterRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ConsulterRaccordement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterRaccordementReadModel>
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

    return Option.match(result).some(mapToReadModel).none();
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterRaccordement', handler);
};

const mapToReadModel = (entity: RaccordementEntity): ConsulterRaccordementReadModel => {
  return {
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        entity.identifiantGestionnaireRéseau,
      ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    dossiers: entity.dossiers.map(
      ({
        demandeComplèteRaccordement,
        miseÀJourLe,
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
                entity.identifiantProjet,
                TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
                  référence,
                ).formatter(),
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
        miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
      }),
    ),
  };
};
