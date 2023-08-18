import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';

import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

import { convertReadableStreamToString } from '../helpers/convertReadableToString';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

// TODO: À supprimer lors de la reorg des step definitions et assertion sur les agrégat
Quand(
  `le porteur modifie le gestionnaire de réseau de son projet avec le gestionnaire {string}`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Alors(
  'le projet devrait avoir {int} dossiers de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    actual.références.should.length(nombreDeDemandes);
  },
);

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const actualDossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      },
    });

    const expectedDossierRaccordement: DossierRaccordementReadModel = {
      demandeComplèteRaccordement: {
        dateQualification: this.raccordementWorld.dateQualification.formatter(),
        accuséRéception: {
          format: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
        },
      },
      référence: this.raccordementWorld.référenceDossierRaccordement,
      type: 'dossier-raccordement',
    };

    actualDossierRaccordement.should.be.deep.equal(expectedDossierRaccordement);

    const accuséRéception =
      await mediator.send<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>({
        type: 'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
        data: {
          identifiantProjet: this.projetWorld.identifiantProjet,
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        },
      });

    if (isNone(accuséRéception)) {
      throw new Error('Demande complète de raccordement non trouvée');
    }

    const actualFormat = accuséRéception.format;
    const expectedFormat = this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format;

    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableStreamToString(accuséRéception.content);
    const expectedContent =
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.content;

    actualContent.should.be.equal(expectedContent);
  },
);

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet`,
  async function (this: PotentielWorld) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
  },
);
