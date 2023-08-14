import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import { isNone } from '@potentiel/monads';
import { expect } from 'chai';
import { convertirEnIdentifiantProjet, loadProjetAggregateFactory } from '@potentiel/domain';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { mediator } from 'mediateur';
import {
  ConsulterFichierAttestationGarantiesFinancièreQuery,
  ConsulterGarantiesFinancièresQuery,
} from '@potentiel/domain-views';
import { convertReadableToString } from '../../../helpers/convertReadableToString';

Alors(
  `les garanties financières du projet {string} devraient être consultable dans le projet`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // Assert on aggregate

    const actualProjetAggregate = await loadProjetAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat projet n'existe pas !`);
    }

    expect(actualProjetAggregate.garantiesFinancières).not.to.be.undefined;

    if (typeGarantiesFinancières) {
      expect(actualProjetAggregate.garantiesFinancières?.typeGarantiesFinancières).to.equals(
        typeGarantiesFinancières,
      );
    }

    if (dateÉchéance) {
      expect(actualProjetAggregate.garantiesFinancières?.dateÉchéance?.date.getTime()).to.equals(
        new Date(dateÉchéance).getTime(),
      );
    } else {
      expect(actualProjetAggregate.garantiesFinancières?.dateÉchéance).to.be.undefined;
    }

    if (format) {
      expect(actualProjetAggregate.garantiesFinancières?.attestationConstitution?.format).to.equals(
        format,
      );
    }

    if (dateConstitution) {
      expect(
        actualProjetAggregate.garantiesFinancières?.attestationConstitution?.date.date.getTime(),
      ).to.equals(new Date(dateConstitution).getTime());
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
  'le fichier devrait être téléchargeable pour le projet {string}',
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
    expect(await convertReadableToString(résultat.content)).to.deep.equal(contenu);
  },
);
