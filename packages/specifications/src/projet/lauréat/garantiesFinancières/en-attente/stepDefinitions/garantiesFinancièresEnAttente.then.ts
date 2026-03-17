import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../../potentiel.world.js';

Alors(
  `des garanties financières devraient être attendues pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateLimiteSoumission, motif } =
      this.lauréatWorld.garantiesFinancièresWorld.actuelles.demander;

    await vérifierGarantiesFinancièresAttendues.call(
      this,
      identifiantProjet,
      motif,
      dateLimiteSoumission,
    );
  },
);

Alors(
  `des garanties financières devraient être attendues pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const exemple = dataTable.rowsHash();
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];
    await vérifierGarantiesFinancièresAttendues.call(
      this,
      identifiantProjet,
      motif,
      dateLimiteSoumission,
    );
  },
);

Alors(
  `les garanties financières ne devraient plus être attendues pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actual = await récupérerGarantiesFinancièresEnAttente.call(this, identifiantProjet);
      expect(actual).to.be.undefined;
    });
  },
);

async function récupérerGarantiesFinancièresEnAttente(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
) {
  const actualReadModel =
    await mediator.send<Lauréat.GarantiesFinancières.ListerGarantiesFinancièresEnAttenteQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
      },
    });

  return actualReadModel.items.find((item) => item.identifiantProjet.estÉgaleÀ(identifiantProjet));
}

async function vérifierGarantiesFinancièresAttendues(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  motif: string,
  dateLimiteSoumission?: string,
) {
  await waitForExpect(async () => {
    const actualReadModel = await récupérerGarantiesFinancièresEnAttente.call(
      this,
      identifiantProjet,
    );

    assert(actualReadModel, 'Aucune garantie financière en attente trouvée pour le projet');
    assert(actualReadModel.motif, 'Le motif des garanties financières en attente doit être défini');
    expect(actualReadModel.motif.formatter()).to.equal(motif);

    if (dateLimiteSoumission) {
      assert(
        actualReadModel.dateLimiteSoumission,
        'La date limite de soumission des garanties financières en attente doit être définie',
      );

      expect(actualReadModel.dateLimiteSoumission.formatter()).to.equal(
        new Date(dateLimiteSoumission).toISOString(),
      );
    }
  });
}
