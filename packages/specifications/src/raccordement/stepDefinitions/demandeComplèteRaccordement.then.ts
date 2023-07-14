import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import {
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  loadRaccordementAggregateFactory,
} from '@potentiel/domain';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { PotentielWorld } from '../../potentiel.world';
import { convertReadableToString } from '../../helpers/convertReadableToString';

Alors(
  `le dossier de raccordement {string} devrait être consultable dans la liste des dossiers de raccordement du projet {string}`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // Assert on aggregate
    const actualRaccordementAggregate = await loadRaccordementAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualRaccordementAggregate)) {
      throw new Error(`L'agrégat raccordement n'existe pas !`);
    }

    actualRaccordementAggregate.contientLeDossier(
      convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement),
    ).should.be.true;

    // Assert on read model
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet,
      },
    });

    actual.références.should.contain(référenceDossierRaccordement);
  },
);

Alors(
  // `la demande complète de raccordement devrait être à jour dans le dossier de raccordement {string} du projet {string}`
  `la demande complète de raccordement devrait être (consultable)(à jour) dans le dossier de raccordement {string} du projet {string}`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const ddemandeComplèteRaccordementFixture =
      this.raccordementWorld.demandeComplèteRaccordementFixtures.get(référenceDossierRaccordement);
    if (!ddemandeComplèteRaccordementFixture) {
      throw new Error('Dossier de raccordement non trouvé dans les jeux de test !');
    }
    const { dateQualification, accuséRéceptionDemandeComplèteRaccordement } =
      ddemandeComplèteRaccordementFixture;

    // Assert on aggregate
    const actualRaccordementAggregate = await loadRaccordementAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualRaccordementAggregate)) {
      throw new Error(`L'agrégat raccordement n'existe pas !`);
    }

    const actualDemandeComplèteRaccordement = actualRaccordementAggregate.dossiers.get(
      référenceDossierRaccordement,
    )?.demandeComplèteRaccordement;
    if (!actualDemandeComplèteRaccordement) {
      throw new Error(`La demande complète de raccordement est introuvable !`);
    }
    actualDemandeComplèteRaccordement.should.deep.equal({
      dateQualification,
      format: accuséRéceptionDemandeComplèteRaccordement.format,
    });

    // Assert on read model
    const actualDossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });

    const expectedDossierRaccordement: DossierRaccordementReadModel = {
      demandeComplèteRaccordement: {
        dateQualification: dateQualification.toISOString(),
        accuséRéception: {
          format: accuséRéceptionDemandeComplèteRaccordement.format,
        },
      },
      référence: référenceDossierRaccordement,
      type: 'dossier-raccordement',
    };

    actualDossierRaccordement.should.be.deep.equal(expectedDossierRaccordement);

    const accuséRéception =
      await mediator.send<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>({
        type: 'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
        data: {
          identifiantProjet,
          référenceDossierRaccordement,
        },
      });

    if (isNone(accuséRéception)) {
      throw new Error('Demande complète de raccordement non trouvée');
    }

    const actualFormat = accuséRéception.format;
    const expectedFormat = accuséRéceptionDemandeComplèteRaccordement.format;

    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableToString(accuséRéception.content);
    const expectedContent = accuséRéceptionDemandeComplèteRaccordement.content;

    actualContent.should.be.equal(expectedContent);
  },
);

Alors(
  'le projet {string} devrait avoir {int} dossiers de raccordement',
  async function (this: PotentielWorld, nomProjet: string, nombreDeDemandes: number) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // Assert on aggregate
    const actualRaccordementAggregate = await loadRaccordementAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualRaccordementAggregate)) {
      throw new Error(`L'agrégat raccordement n'existe pas !`);
    }

    actualRaccordementAggregate.dossiers.should.length(nombreDeDemandes);

    // Assert on read model
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet,
      },
    });

    actual.références.should.length(nombreDeDemandes);
  },
);
