import { mediator } from 'mediateur';
import { fakerFR as faker } from '@faker-js/faker';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Email } from '@potentiel-domain/common';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

export const seedCandidatures = async () => {
  const identifiantProjet = IdentifiantProjet.bind({
    appelOffre: 'PPE2 - Bâtiment',
    période: '2',
    famille: '',
    numéroCRE: faker.number.int({ min: 1000, max: 9999 }).toString(),
  });
  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      dépôtValue: fakeDépôt(),
      instructionValue: fakeInstructionClassé(),
      détailsValue: {},
      importéLe: new Date().toISOString(),
      importéPar: Email.système.email,
    },
  });
};

const fakeDépôt = (): Candidature.Dépôt.RawType => ({
  nomProjet: faker.company.catchPhrase(),
  nomCandidat: faker.company.name(),
  emailContact: faker.internet.email(),
  sociétéMère: faker.company.name(),
  nomReprésentantLégal: faker.person.fullName(),
  prixReference: fakeNumber(10, 150),
  localité: fakeLocalité(),
  historiqueAbandon: 'première-candidature',
  puissance: fakeNumber(0, 3),
  puissanceALaPointe: false,
  puissanceDeSite: undefined,
  puissanceProjetInitial: undefined,
  coefficientKChoisi: undefined,
  evaluationCarboneSimplifiée: fakeNumber(200, 600),
  technologie: 'N/A',
  actionnariat: faker.helpers.arrayElement(Candidature.TypeActionnariat.ppe2Types),
  typeGarantiesFinancières: 'consignation',
  dateÉchéanceGf: undefined,
  attestationConstitutionGf: undefined,
  dateConstitutionGf: undefined,
  territoireProjet: '',
  fournisseurs: [],
  typologieInstallation: [],
  obligationDeSolarisation: undefined,
  autorisationDUrbanisme: undefined,
  installateur: undefined,
  dispositifDeStockage: undefined,
  natureDeLExploitation: undefined,
});

const fakeLocalité = (): Candidature.Localité.RawType => {
  const codePostal = faker.location.zipCode({});
  const commune = faker.location.city(); // TODO commune based on code postal
  const result = récupérerDépartementRégionParCodePostal(codePostal);
  if (!result) {
    return fakeLocalité();
  }
  return {
    adresse1: faker.location.streetAddress(),
    adresse2: faker.helpers.maybe(() => faker.location.secondaryAddress()) ?? '',
    codePostal,
    commune,
    département: result.département,
    région: result.région,
  };
};

const fakeInstructionClassé = (): Candidature.Instruction.RawType => ({
  noteTotale: fakeNumber(0, 100),
  motifÉlimination: undefined,
  statut: 'classé',
});

const fakeInstructionÉliminé = (): Candidature.Instruction.RawType => ({
  noteTotale: fakeNumber(0, 100),
  motifÉlimination: faker.lorem.sentence(),
  statut: 'éliminé',
});

const fakeInstruction = () =>
  faker.helpers.maybe(() => fakeInstructionClassé()) ?? fakeInstructionÉliminé();

const fakeNumber = (min: number, max: number) => +faker.commerce.price({ min, max });
