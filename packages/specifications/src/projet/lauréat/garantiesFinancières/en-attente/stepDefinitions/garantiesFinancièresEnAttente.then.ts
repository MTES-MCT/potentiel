import { Then as Alors, type DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../../potentiel.world.js';

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
  `des garanties financières devraient être attendues avec :`,
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
      const actual = await récupérerGarantiesFinancièresEnAttenteDansLaListe.call(
        this,
        identifiantProjet,
      );
      expect(actual).to.be.undefined;
    });
  },
);

async function récupérerGarantiesFinancièresEnAttenteDansLaListe(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
) {
  const actualReadModel =
    await mediator.send<Lauréat.GarantiesFinancières.ListerGarantiesFinancièresEnAttenteQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
      data: {
        identifiantUtilisateur: this.utilisateurWorld.dgecFixture.email,
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
    const actuelReadModelForLister = await récupérerGarantiesFinancièresEnAttenteDansLaListe.call(
      this,
      identifiantProjet,
    );

    assert(
      actuelReadModelForLister,
      'Aucune garantie financière en attente trouvée pour le projet',
    );
    assert(
      actuelReadModelForLister.motif,
      'Le motif des garanties financières en attente doit être défini',
    );
    expect(actuelReadModelForLister.motif.formatter()).to.equal(motif);

    if (dateLimiteSoumission) {
      assert(
        actuelReadModelForLister.dateLimiteSoumission,
        'La date limite de soumission des garanties financières en attente doit être définie',
      );

      expect(actuelReadModelForLister.dateLimiteSoumission.formatter()).to.equal(
        new Date(dateLimiteSoumission).toISOString(),
      );
    }

    const actualReadModelForConsulter =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        },
      );

    assert(
      Option.isSome(actualReadModelForConsulter),
      'Aucune garantie financière en attente trouvée pour le projet lors de la consultation',
    );
    expect(actualReadModelForConsulter.motifEnAttente.motif).to.equal(motif);

    if (dateLimiteSoumission) {
      expect(actualReadModelForConsulter.dateLimiteSoumission.formatter()).to.equal(
        new Date(dateLimiteSoumission).toISOString(),
      );
    }
  });
}
