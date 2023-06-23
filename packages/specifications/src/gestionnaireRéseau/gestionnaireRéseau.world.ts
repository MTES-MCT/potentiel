import { expect } from 'chai';
import { sleep } from '../helpers/sleep';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnRéférenceDossierRaccordement,
  loadGestionnaireRéseauAggregateFactory,
} from '@potentiel/domain';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { isNone } from '@potentiel/monads';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
} from '@potentiel/domain-views';

type GestionnaireRéseau = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
};

export class GestionnaireRéseauWorld {
  #gestionnairesRéseauFixtures: Map<string, GestionnaireRéseau> = new Map();

  constructor() {}

  async ajouterEnedis() {
    await this.ajouterGestionnaireRéseau({
      codeEIC: '17X100A100A0001A',
      raisonSociale: 'Enedis',
      aideSaisieRéférenceDossierRaccordement: {
        format: '',
        légende: '',
        expressionReguliere: `[a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}`,
      },
    });
  }

  async ajouterGestionnaireRéseau(
    gestionnaireRéseau: Partial<GestionnaireRéseau> & { codeEIC: string },
  ) {
    const { codeEIC, raisonSociale = 'Une raison sociale' } = gestionnaireRéseau;
    const aideSaisieRéférenceDossierRaccordement =
      gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement ?? {
        format: '',
        légende: '',
        expressionReguliere: '.',
      };

    await mediator.send<DomainUseCase>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    });

    this.#gestionnairesRéseauFixtures.set(raisonSociale, {
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    });
    await sleep(100);
  }

  async modifierGestionnaireRéseau(gestionnaireRéseau: GestionnaireRéseau) {
    const { codeEIC, raisonSociale, aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;

    await mediator.send<DomainUseCase>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    });

    this.#gestionnairesRéseauFixtures.set(raisonSociale, {
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    });
    await sleep(100);
  }

  rechercherGestionnaireRéseauFixture(raisonSociale: string): GestionnaireRéseau {
    const gestionnaireRéseau = this.#gestionnairesRéseauFixtures.get(raisonSociale);

    if (!gestionnaireRéseau) {
      throw new Error(
        `Aucun gestionnaire réseau correspondant à ${raisonSociale} dans les jeux de données`,
      );
    }

    return JSON.parse(JSON.stringify(gestionnaireRéseau));
  }

  async devraitÊtreDisponibleDansRéférentiel(raisonSociale: string) {
    const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

    const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
    actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

    const actual = await mediator.send<GestionnaireRéseauQuery>({
      type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {},
    });

    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      ...gestionnaireRéseau,
    };

    actual.should.deep.contain(expected);
  }

  async devraitÊtreConsultable(raisonSociale: string) {
    const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

    const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
    actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

    const actual = await mediator.send<ConsulterGestionnaireRéseauQuery>({
      type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {
        identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
      },
    });

    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      ...gestionnaireRéseau,
    };

    actual.should.be.deep.equal(expected);
  }

  async devraitÊtreUnRéférenceValideOuInvalide(
    raisonSociale: string,
    référenceÀValider: string,
    expected: 'valide' | 'invalide',
  ) {
    const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

    const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
    const actual = actualAggregate.validerRéférenceDossierRaccordement(
      convertirEnRéférenceDossierRaccordement(référenceÀValider),
    );
    actual.should.equal(expected === 'valide' ? true : false);

    const actualReadModel = await mediator.send<ConsulterGestionnaireRéseauQuery>({
      type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {
        identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
      },
    });

    if (isNone(actualReadModel)) {
      throw new Error(`Le read model gestionnaire de réseau n'existe pas !`);
    }
    expect(actualReadModel.aideSaisieRéférenceDossierRaccordement.expressionReguliere).not.to.be
      .undefined;

    expect(
      new RegExp(actualReadModel.aideSaisieRéférenceDossierRaccordement?.expressionReguliere!).test(
        référenceÀValider,
      ),
    ).to.equal(expected === 'valide' ? true : false);
  }
}

const loadGestionnaireRéseauAggregate = async (codeEIC: string) => {
  const actualAggregate = await loadGestionnaireRéseauAggregateFactory({ loadAggregate })(
    convertirEnIdentifiantGestionnaireRéseau(codeEIC),
  );

  if (isNone(actualAggregate)) {
    throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
  }

  return actualAggregate;
};
