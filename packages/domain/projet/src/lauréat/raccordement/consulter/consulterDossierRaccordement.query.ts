import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { type Find, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../index.js';
import type { Raccordement } from '../../index.js';
import type { DossierRaccordementEntity } from '../dossierRaccordement.entity.js';
import { DocumentRaccordement } from '../index.js';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType.js';

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
    document: DocumentProjet.ValueType;
  };
  conventionDeRaccordement?: {
    dateSignature: DateTime.ValueType;
    document: DocumentProjet.ValueType;
  };
  conventionDirecteDeRaccordement?: {
    dateSignature: DateTime.ValueType;
    document: DocumentProjet.ValueType;
  };
  miseEnService?: {
    dateMiseEnService?: DateTime.ValueType;
  };
  miseÀJourLe: DateTime.ValueType;
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
    const result = await find<DossierRaccordementEntity, Raccordement.RaccordementEntity>(
      `dossier-raccordement|${identifiantProjetValue}#${référenceDossierRaccordement}`,
      {
        join: {
          entity: 'raccordement',
          on: 'identifiantProjet',
          where: { désactivé: Where.equalNull() },
        },
      },
    );

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterDossierRaccordement', handler);
};

export const mapToReadModel = ({
  identifiantGestionnaireRéseau,
  demandeComplèteRaccordement,
  propositionTechniqueEtFinancière,
  conventionDeRaccordement,
  conventionDirecteDeRaccordement,
  miseEnService,
  identifiantProjet,
  référence,
  miseÀJourLe,
}: DossierRaccordementEntity): ConsulterDossierRaccordementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    référence: RéférenceDossierRaccordement.convertirEnValueType(référence),
    demandeComplèteRaccordement: {
      dateQualification: demandeComplèteRaccordement?.dateQualification
        ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
        : undefined,
      accuséRéception: DocumentRaccordement.accuséRéception({
        identifiantProjet,
        référenceDossierRaccordement: référence,
        // Initialement dans le legacy certaines DCR n'avait pas de date de qualification.
        // Lorsque le domaine raccordement a été migré, l'optionalité de la date a été conservée.
        // Par la suite, le domain Document a été introduit pour harmoniser la gestion des documents
        // Ce module s'appuie sur des dates pour les noms de fichier
        // Dans le cas de la DCR étant donnée que les date ne sont pas toujours présentes, une date par défaut au 1er commit du projet a été mise en place. Les fichiers correspondant dans le bucket ont la même date.
        // Au moment de l'introduction de ce changement (2024-02-08), il y avait 946 DCR ayant le soucis.
        // Pour corriger le probléme définitivement il faudrait mettre la date de qualification contenu dans le fichier,
        // Mais étant donné que le legacy n'avait pas de restriction au niveau du format de fichier, il est compliqué d'extraire automatiquement cette information
        dateQualification:
          demandeComplèteRaccordement?.dateQualification || '2020-02-17T00:00:00.000Z',
        accuséRéception: demandeComplèteRaccordement?.accuséRéception,
      }),
    },
    propositionTechniqueEtFinancière: propositionTechniqueEtFinancière
      ? {
          dateSignature: DateTime.convertirEnValueType(
            propositionTechniqueEtFinancière.dateSignature,
          ),
          document: DocumentRaccordement.documentRaccordement(
            'proposition-technique-et-financière',
          )({
            identifiantProjet,
            référenceDossierRaccordement: référence,
            dateSignature: propositionTechniqueEtFinancière.dateSignature,
            document: propositionTechniqueEtFinancière.document,
          }),
        }
      : undefined,
    conventionDeRaccordement: conventionDeRaccordement
      ? {
          dateSignature: DateTime.convertirEnValueType(conventionDeRaccordement.dateSignature),
          document: DocumentRaccordement.documentRaccordement('convention-de-raccordement')({
            identifiantProjet,
            référenceDossierRaccordement: référence,
            dateSignature: conventionDeRaccordement.dateSignature,
            document: conventionDeRaccordement.document,
          }),
        }
      : undefined,
    conventionDirecteDeRaccordement: conventionDirecteDeRaccordement
      ? {
          dateSignature: DateTime.convertirEnValueType(
            conventionDirecteDeRaccordement.dateSignature,
          ),
          document: DocumentRaccordement.documentRaccordement('convention-directe-de-raccordement')(
            {
              identifiantProjet,
              référenceDossierRaccordement: référence,
              dateSignature: conventionDirecteDeRaccordement.dateSignature,
              document: conventionDirecteDeRaccordement.document,
            },
          ),
        }
      : undefined,
    miseEnService: miseEnService?.dateMiseEnService
      ? {
          dateMiseEnService: DateTime.convertirEnValueType(miseEnService.dateMiseEnService),
        }
      : undefined,
    miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
  };
};
