import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import { isNone } from '@potentiel/monads';
import { expect } from 'chai';
import {
  convertirEnIdentifiantProjet,
  loadGarantiesFinancièresAggregateFactory,
} from '@potentiel/domain';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { mediator } from 'mediateur';
import {
  ConsulterFichierAttestationGarantiesFinancièreQuery,
  ConsulterGarantiesFinancièresQuery,
} from '@potentiel/domain-views';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString';

Alors(
  `les garanties financières (complètes )devraient être (consultables )(mises à jour )pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // Assert on aggregate

    const actualGarantiesFinancièresAggregate = await loadGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualGarantiesFinancièresAggregate)) {
      throw new Error(`L'agrégat GF n'existe pas !`);
    }

    expect(actualGarantiesFinancièresAggregate.actuelles).not.to.be.undefined;

    if (actualGarantiesFinancièresAggregate.actuelles) {
      if (typeGarantiesFinancières) {
        expect(actualGarantiesFinancièresAggregate.actuelles.typeGarantiesFinancières).to.equals(
          typeGarantiesFinancières,
        );
      }

      if (dateÉchéance) {
        expect('dateÉchéance' in actualGarantiesFinancièresAggregate.actuelles).to.be.true;
        'dateÉchéance' in actualGarantiesFinancièresAggregate.actuelles &&
          expect(
            actualGarantiesFinancièresAggregate.actuelles.dateÉchéance.date.getTime(),
          ).to.equals(new Date(dateÉchéance).getTime());
      }

      if (format) {
        expect(
          actualGarantiesFinancièresAggregate.actuelles.attestationConstitution?.format,
        ).to.equals(format);
      }

      if (dateConstitution) {
        expect(
          actualGarantiesFinancièresAggregate.actuelles.attestationConstitution?.date.date.getTime(),
        ).to.equals(new Date(dateConstitution).getTime());
      }
    }

    // Assert on read model

    const résultat = await mediator.send<ConsulterGarantiesFinancièresQuery>({
      type: 'CONSULTER_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(résultat)) {
      throw new Error('garanties financières non trouvées');
    }

    expect(résultat).not.to.be.undefined;

    const expected = {
      type: 'garanties-financières',
      ...(typeGarantiesFinancières && { typeGarantiesFinancières }),
      ...(dateÉchéance && { dateÉchéance: new Date(dateÉchéance).toISOString() }),
      ...(format &&
        dateConstitution && {
          attestationConstitution: { format, date: new Date(dateConstitution).toISOString() },
        }),
    };

    expect(résultat).to.deep.equal(expected);
  },
);

Alors(
  `le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet {string} avec :`,
  async function (nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const contenu = exemple['contenu fichier'];
    const format = exemple['format'];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const résultat = await mediator.send<ConsulterFichierAttestationGarantiesFinancièreQuery>({
      type: 'CONSULTER_ATTESTATION_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(résultat)) {
      throw new Error('attestation garanties financières non trouvée');
    }

    expect(résultat.type).to.deep.equal('attestation-constitution-garanties-financieres');
    expect(résultat.format).to.deep.equal(format);
    expect(await convertReadableStreamToString(résultat.content)).to.deep.equal(contenu);
  },
);
