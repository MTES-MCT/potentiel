import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { AbstractFixture, DeepPartial } from '../../fixture';

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
    identifiantProjet,
  }: {
    identifiantProjet?: string;
    values: DeepPartial<ImporterCandidature['values']> & {
      statutValue: string;
      importéPar: string;
    };
  }): Readonly<ImporterCandidature> {
    this.#identifiantProjet = identifiantProjet ?? getValidFakeIdentifiantProjet();
    const { appelOffre, période, famille, numéroCRE } = IdentifiantProjet.convertirEnValueType(
      this.#identifiantProjet,
    );

    const localitéValue = {
      adresse1: faker.location.streetAddress(),
      adresse2: faker.location.secondaryAddress(),
      codePostal: faker.location.zipCode(),
      commune: faker.location.city(),
      région: faker.location.state(),
      département: faker.location.state(),
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
      prixReferenceValue: faker.number.float({ min: 0.1, max: 3 }),
      noteTotaleValue: faker.number.int({ min: 0, max: 5 }),
      nomReprésentantLégalValue: faker.person.fullName(),
      evaluationCarboneSimplifiéeValue: faker.number.float({ min: 0.1, max: 3 }),
      actionnariat: faker.helpers.maybe(() =>
        faker.helpers.arrayElement(Candidature.TypeActionnariat.types),
      ),
      financementCollectifValue: false,
      gouvernancePartagéeValue: false,
      financementParticipatifValue: false,
      importéLe: new Date().toISOString(),
      ...values,
      détailsValue: {
        'Rendement nominal': '1234',
        ...values?.détailsValue,
      },
      localitéValue,
    };
    this.#values = fixture;

    this.aÉtéCréé = true;

    return {
      identifiantProjet: this.identifiantProjet,
      values: this.values,
    };
  }
}

// Pour l'import, il est impératif que le projet soit sur une période non legacy
function getValidFakeIdentifiantProjet(): string {
  const identifiantProjet = faker.potentiel.identifiantProjet();
  const { appelOffre, période } = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const périodeData = appelsOffreData
    .find((x) => x.id === appelOffre)
    ?.periodes.find((x) => x.id === période);

  if (!périodeData) {
    return getValidFakeIdentifiantProjet();
  }

  if (périodeData.type === 'legacy') {
    return getValidFakeIdentifiantProjet();
  }
  return identifiantProjet;
}
