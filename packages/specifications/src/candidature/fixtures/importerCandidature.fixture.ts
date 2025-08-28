import { faker } from '@faker-js/faker';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture, DeepPartial } from '../../fixture';
import { getFakeLocation } from '../../helpers/getFakeLocation';

interface ImporterCandidature {
  dépôtValue: Candidature.Dépôt.RawType;
  instructionValue: Candidature.Instruction.RawType;

  détailsValue: Record<string, string>;
  importéPar: string;
  importéLe: string;
}

export type ImporterCandidatureFixtureCréerProps = {
  importéPar: string;
  importéLe?: string;
  dépôt?: Omit<DeepPartial<ImporterCandidature['dépôtValue']>, 'fournisseurs'>;
  instruction: DeepPartial<ImporterCandidature['instructionValue']> &
    Pick<ImporterCandidature['instructionValue'], 'statut'>;
  identifiantProjet?: Partial<PlainType<IdentifiantProjet.ValueType>>;
  détails?: ImporterCandidature['détailsValue'];
};

export class ImporterCandidatureFixture
  extends AbstractFixture<ImporterCandidature>
  implements ImporterCandidature
{
  #identifiantProjet!: IdentifiantProjet.RawType;
  get identifiantProjet(): IdentifiantProjet.RawType {
    return this.#identifiantProjet;
  }

  #dépôtValue!: ImporterCandidature['dépôtValue'];
  get dépôtValue() {
    return this.#dépôtValue;
  }

  #instructionValue!: ImporterCandidature['instructionValue'];
  get instructionValue() {
    return this.#instructionValue;
  }

  #importéPar: string = '';
  get importéPar() {
    return this.#importéPar;
  }
  #importéLe: string = '';
  get importéLe() {
    return this.#importéLe;
  }

  #détailsValue: Record<string, string> = {};
  get détailsValue() {
    return this.#détailsValue;
  }

  /**
   * @deprecated kept for retro-compat, prefer dépôtValue & instructionValue
   */
  get values() {
    const dépôt = this.dépôtValue;
    return {
      nomProjetValue: dépôt.nomProjet,
      nomCandidatValue: dépôt.nomCandidat,
      emailContactValue: dépôt.emailContact,
      sociétéMèreValue: dépôt.sociétéMère,
      puissanceProductionAnnuelleValue: dépôt.puissanceProductionAnnuelle,
      nomReprésentantLégalValue: dépôt.nomReprésentantLégal,
      localitéValue: dépôt.localité,
      typeGarantiesFinancièresValue: dépôt.typeGarantiesFinancières,
      dateÉchéanceGfValue: dépôt.dateÉchéanceGf,
    };
  }

  créer({
    identifiantProjet: { appelOffre, famille, numéroCRE, période } = {},
    instruction,
    dépôt,
    importéPar,
    importéLe,
    détails,
  }: ImporterCandidatureFixtureCréerProps): Readonly<ImporterCandidatureFixture> {
    const identifiantProjet = getValidFakeIdentifiantProjet({
      appelOffre,
      famille,
      numéroCRE,
      période,
    });

    const dépôtValue = créerDépôt(identifiantProjet, dépôt);

    const instructionValue: ImporterCandidature['instructionValue'] = {
      motifÉlimination:
        instruction.motifÉlimination ??
        (instruction.statut === 'éliminé' ? faker.word.words() : undefined),
      noteTotale: instruction.noteTotale ?? faker.number.int({ min: 0, max: 5 }),
      statut: instruction.statut,
    };

    const détailsValue: ImporterCandidature['détailsValue'] = {
      'Rendement nominal': '1234',
      ...détails,
    };

    this.#identifiantProjet = identifiantProjet.formatter();
    this.#dépôtValue = dépôtValue;
    this.#instructionValue = instructionValue;
    this.aÉtéCréé = true;
    this.#importéPar = importéPar;
    this.#importéLe = importéLe ?? new Date().toISOString();
    this.#détailsValue = détailsValue;

    return this;
  }
}

// Pour l'import, il est impératif que le projet soit sur une période non legacy
function getValidFakeIdentifiantProjet(
  props: Partial<PlainType<IdentifiantProjet.ValueType>>,
): IdentifiantProjet.ValueType {
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
  return IdentifiantProjet.convertirEnValueType(identifiantProjet);
}

const créerDépôt = (
  identifiantProjet: IdentifiantProjet.ValueType,
  dépôt: Omit<DeepPartial<ImporterCandidature['dépôtValue']>, 'fournisseurs'> = {},
) => {
  const { appelOffre, période } = identifiantProjet;

  const aoData = appelsOffreData.find((x) => x.id === appelOffre);

  const localité: Candidature.Localité.RawType = {
    adresse1: faker.location.streetAddress(),
    adresse2: faker.location.secondaryAddress(),
    ...getFakeLocation(),
    ...dépôt.localité,
  };

  const dépôtValue: ImporterCandidature['dépôtValue'] = {
    typeGarantiesFinancières: dépôt?.typeGarantiesFinancières ?? 'consignation',
    nomProjet: faker.company.name(),
    nomCandidat: faker.person.fullName(),
    technologie: aoData?.multiplesTechnologies
      ? faker.helpers.arrayElement(AppelOffre.technologies)
      : 'N/A',
    emailContact: faker.internet.email(),
    puissanceALaPointe: true,
    sociétéMère: faker.company.name(),
    territoireProjet: '',
    historiqueAbandon: faker.helpers.arrayElement(Candidature.HistoriqueAbandon.types),
    puissanceProductionAnnuelle: faker.number.float({ min: 0.1, max: 3 }),
    prixReference: faker.number.float({ min: 0.1, max: 3 }),
    nomReprésentantLégal: faker.person.fullName(),
    evaluationCarboneSimplifiée: faker.number.float({ min: 0.1, max: 3 }),
    actionnariat: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(Candidature.TypeActionnariat.types),
    ),
    dateÉchéanceGf: undefined,
    dateDélibérationGf: undefined,
    coefficientKChoisi: undefined,
    obligationDeSolarisation: undefined,
    puissanceDeSite:
      aoData?.champsSupplémentaires?.puissanceDeSite === 'requis'
        ? faker.number.int({ min: 1 })
        : undefined,

    ...dépôt,

    typologieInstallation: [{ typologie: 'bâtiment.neuf' }],
    fournisseurs: [
      {
        typeFournisseur: 'cellules' as const,
        nomDuFabricant: faker.company.name(),
        lieuDeFabrication: faker.location.country(),
      },
    ],
    localité,
    autorisationDUrbanisme: dépôt.autorisationDUrbanisme
      ? { date: DateTime.now().formatter(), numéro: '12', ...dépôt.autorisationDUrbanisme }
      : undefined,
  };

  const référentielPériode = appelsOffreData
    .find((ao) => ao.id === appelOffre)
    ?.periodes.find((p) => p.id === période);

  if (
    référentielPériode?.champsSupplémentaires?.coefficientKChoisi &&
    !('coefficientKChoisi' in dépôt)
  ) {
    dépôtValue.coefficientKChoisi = faker.datatype.boolean();
  }

  return dépôtValue;
};
