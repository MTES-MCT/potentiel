import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';

Alors('le fournisseur devrait être mis à jour', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(fournisseur), `Aucun fournisseur`);
    assert(Option.isSome(candidature), `Aucune candidature`);

    const actual = mapToPlainObject(fournisseur);
    const expected = mapToPlainObject(
      this.lauréatWorld.fournisseurWorld.mapToExpected(fournisseur.identifiantProjet, candidature),
    );

    expect(actual).to.deep.eq(expected);
  });
});

Alors(
  'le changement enregistré du fournisseur du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const demandeEnCours =
        await mediator.send<Lauréat.Fournisseur.ConsulterChangementFournisseurQuery>({
          type: 'Lauréat.Fournisseur.Query.ConsulterChangementFournisseur',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            enregistréLe: this.lauréatWorld.fournisseurWorld.mettreÀJourFournisseur.misAJourLe,
          },
        });

      assert(Option.isSome(demandeEnCours), 'Demande de changement de fournisseur non trouvée !');

      const actual = mapToPlainObject(demandeEnCours);

      const expected = mapToPlainObject(
        this.lauréatWorld.fournisseurWorld.mapChangementToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);
