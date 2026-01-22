import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const { commune, codePostal } = this.candidatureWorld.importerCandidature.values.localitéValue;
    const codeEIC =
      this.gestionnaireRéseauWorld.rechercherOREParVille({ commune, codePostal })?.codeEIC ?? '';

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    );
  },
);

async function vérifierGestionnaireAttribué(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
) {
  await waitForExpect(async () => {
    // Assert on read model
    const résultat = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(résultat));

    expect(résultat.identifiantGestionnaireRéseau.codeEIC).to.eq(
      identifiantGestionnaireRéseau.codeEIC,
      'raccordement invalide',
    );

    for (const { référence } of résultat.dossiers) {
      const dossier = await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: référence.formatter(),
        },
      });
      assert(Option.isSome(dossier));
      expect(dossier.identifiantGestionnaireRéseau.codeEIC).to.eq(
        identifiantGestionnaireRéseau.codeEIC,
        'dossier invalide',
      );
    }
  });
}
