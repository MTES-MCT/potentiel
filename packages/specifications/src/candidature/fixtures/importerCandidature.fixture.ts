import { faker } from '@faker-js/faker';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { PlainType } from '@potentiel-domain/core';

import { AbstractFixture, DeepPartial } from '../../fixture';
import { getFakeLocation } from '../../helpers/getFakeLocation';

interface ImporterCandidature {
  identifiantProjet: string;
  values: Candidature.ImporterCandidatureUseCase['data'];
}

export class ImporterCandidatureFixture
  extends AbstractFixture<ImporterCandidature>
  implements ImporterCandidature
{
  #identifiantProjet!: string;
  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #values!: Candidature.ImporterCandidatureUseCase['data'];
  get values() {
    return this.#values;
  }

  créer({
    values,
  }: {
    values: DeepPartial<ImporterCandidature['values']> & {
      statutValue: string;
      importéPar: string;
    };
  }): Readonly<ImporterCandidature> {
    this.#identifiantProjet = getValidFakeIdentifiantProjet({
      appelOffre: values.appelOffreValue,
      période: values.périodeValue,
      famille: values.familleValue,
      numéroCRE: values.numéroCREValue,
    });
    const { appelOffre, période, famille, numéroCRE } = IdentifiantProjet.convertirEnValueType(
      this.#identifiantProjet,
    );

    const localitéValue = {
      adresse1: faker.location.streetAddress(),
      adresse2: faker.location.secondaryAddress(),
      ...getFakeLocation(),
      ...values.localitéValue,
    };

    const fixture = {
      appelOffreValue: appelOffre,
      périodeValue: période,
      familleValue: famille,
      numéroCREValue: numéroCRE,
      motifÉliminationValue: values.statutValue === 'éliminé' ? faker.word.words() : '',
      typeGarantiesFinancièresValue: values?.typeGarantiesFinancièresValue ?? 'consignation',
      nomProjetValue: faker.company.name(),
      nomCandidatValue: faker.person.fullName(),
      technologieValue: 'N/A',
      emailContactValue: faker.internet.email(),
      puissanceALaPointeValue: true,
      sociétéMèreValue: faker.company.name(),
      territoireProjetValue: '',
      dateÉchéanceGfValue: values?.dateÉchéanceGfValue
        ? new Date(values.dateÉchéanceGfValue).toISOString()
        : '',
      historiqueAbandonValue: faker.helpers.arrayElement(Candidature.HistoriqueAbandon.types),
      puissanceProductionAnnuelleValue: faker.number.float({ min: 0.1, max: 3 }),
      prixRéférenceValue: faker.number.float({ min: 0.1, max: 3 }),
      noteTotaleValue: faker.number.int({ min: 0, max: 5 }),
      nomReprésentantLégalValue: faker.person.fullName(),
      evaluationCarboneSimplifiéeValue: faker.number.float({ min: 0.1, max: 3 }),
      actionnariat:
        values?.actionnariatValue ??
        faker.helpers.maybe(() => faker.helpers.arrayElement(Candidature.TypeActionnariat.types)),
      financementCollectifValue:
        values?.actionnariatValue === Candidature.TypeActionnariat.financementCollectif.type,
      gouvernancePartagéeValue:
        values?.actionnariatValue === Candidature.TypeActionnariat.gouvernancePartagée.type,
      financementParticipatifValue:
        values?.actionnariatValue === Candidature.TypeActionnariat.financementParticipatif.type,
      importéLe: new Date().toISOString(),
      ...values,
      détailsValue: {
        'Rendement nominal': '1234',
        ...values?.détailsValue,
      },
      localitéValue,
    };

    const référentielPériode = appelsOffreData
      .find((ao) => ao.id === appelOffre)
      ?.periodes.find((p) => p.id === période);

    if (
      référentielPériode?.choixCoefficientKDisponible === true &&
      !('coefficientKChoisiValue' in values)
    ) {
      fixture.coefficientKChoisiValue = faker.datatype.boolean();
    }

    this.#values = fixture;

    this.aÉtéCréé = true;

    return {
      identifiantProjet: this.identifiantProjet,
      values: this.values,
    };
  }
}

// Pour l'import, il est impératif que le projet soit sur une période non legacy
function getValidFakeIdentifiantProjet(
  props: Partial<PlainType<IdentifiantProjet.ValueType>>,
): string {
  const identifiantProjet = faker.potentiel.identifiantProjet(props);
  const { appelOffre, période } = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const périodeData = appelsOffreData
    .find((x) => x.id === appelOffre)
    ?.periodes.find((x) => x.id === période);

  if (!périodeData && props.période === undefined) {
    return getValidFakeIdentifiantProjet(props);
  }

  if (périodeData?.type === 'legacy' && !props.appelOffre && !props.période) {
    return getValidFakeIdentifiantProjet(props);
  }
  return identifiantProjet;
}
