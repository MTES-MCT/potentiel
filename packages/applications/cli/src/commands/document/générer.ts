import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';

import { Command, Flags } from '@oclif/core';
import type { Faker } from '@faker-js/faker';

import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

const types = [
  'abandon',
  'recours',
  'mainlevée',
  'mise-en-demeure',
  'actionnaire',
  'puissance',
  'délai',
] as const;
export type TypeDocument = ModèleRéponseSignée.GénérerModèleRéponseOptions['type'];

export default class GénérerDocument extends Command {
  #faker!: Faker;

  static override description = 'Modifier GRD depuis un CSV';

  static override flags = {
    type: Flags.option({ options: [...types] })({ required: true }),
    logo: Flags.string(),
  };

  protected async init() {
    // Faker est importé dynamiquement car c'est une dev dependency, et n'est pas dispo en env de prod
    const { fakerFR } = await import('@faker-js/faker');
    this.#faker = fakerFR as unknown as Faker;
  }

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { flags } = await this.parse(GénérerDocument);

    const readableStream = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      logo: flags.logo,
      ...getData(flags.type, this.#faker),
    });

    const outputPath = path.join(process.cwd(), `${flags.type}.docx`);
    const writableStream = fs.createWriteStream(outputPath);

    const nodeReadableStream = Stream.Readable.from(readableStream);
    nodeReadableStream.pipe(writableStream);

    writableStream.on('finish', () => {
      console.info('Le fichier a été écrit avec succès:', outputPath);
    });
  }
}

function getData(
  type: TypeDocument,
  faker: Faker,
): ModèleRéponseSignée.GénérerModèleRéponseOptions {
  const appelOffre = faker.helpers.arrayElement(appelsOffreData);
  const common = {
    suiviPar: faker.person.fullName(), // user qui édite le document
    suiviParEmail: faker.internet.email(),
    dreal: '',
    refPotentiel: faker.commerce.isbn(),
    nomRepresentantLegal: faker.person.fullName(),
    nomCandidat: faker.person.fullName(),
    adresseCandidat: faker.location.streetAddress(),
    email: faker.internet.email(),
    titrePeriode: appelOffre.periodes[0].title,
    titreAppelOffre: appelOffre.title,
    familles: 'yes' as const,
    titreFamille: '',
    nomProjet: faker.company.name(),
    puissance: faker.number.float({ max: 10, fractionDigits: 2 }).toString(),
    codePostalProjet: faker.location.zipCode(),
    communeProjet: faker.location.city(),
    unitePuissance: 'MWh',
    dateDemande: faker.date.recent().toLocaleDateString('fr-FR'),
    justificationDemande: '',
    dateNotification: new Date().toLocaleDateString('fr-FR'),
    enCopies: ['DREAL concernée', 'CRE'],
  };
  switch (type) {
    case 'abandon':
      return {
        type,
        data: {
          ...common,
          status: 'accordé',
          aprèsConfirmation: true,
          referenceParagrapheAbandon:
            appelOffre.donnéesCourriersRéponse.texteEngagementRéalisationEtModalitésAbandon
              ?.référenceParagraphe ?? '!!!MANQUANT!!!',
          contenuParagrapheAbandon:
            appelOffre.donnéesCourriersRéponse.texteEngagementRéalisationEtModalitésAbandon
              ?.dispositions ?? '!!!MANQUANT!!!',
          dateDemandeConfirmation: faker.date.recent().toLocaleDateString('fr-FR'),
          dateConfirmation: faker.date.recent().toLocaleDateString('fr-FR'),
        },
      };
    case 'recours':
      return {
        type,
        data: {
          ...common,
          status: '',
          prixReference: '',
          evaluationCarbone: '',
          isFinancementParticipatif: 'yes' as const,
          isInvestissementParticipatif: 'yes' as const,
          isEngagementParticipatif: 'yes' as const,
          engagementFournitureDePuissanceAlaPointe: 'yes' as const,
          nonInstruit: 'yes' as const,
          motifsElimination: '',
          tarifOuPrimeRetenue: '',
          paragraphePrixReference: '',
          affichageParagrapheECS: 'yes' as const,
          unitePuissance: '',
          eolien: 'yes' as const,
          AOInnovation: 'yes' as const,
          soumisGF: 'yes' as const,
          renvoiSoumisAuxGarantiesFinancieres: '',
          renvoiDemandeCompleteRaccordement: '',
          renvoiRetraitDesignationGarantieFinancieres: '',
          paragrapheDelaiDerogatoire: '',
          paragrapheAttestationConformite: '',
          paragrapheEngagementIPFPGPFC: '',
          renvoiModification: '',
          delaiRealisationTexte: '',
          isFinancementCollectif: 'yes' as const,
          isGouvernancePartagée: 'yes' as const,
        },
      };
    case 'mainlevée':
      return {
        type,
        data: {
          ...common,
          adresseProjet: common.adresseCandidat,
          emailProjet: common.email,

          contactDreal: '',
          dateCourrier: '',
          referenceProjet: '',
          dateConstitutionGarantiesFinancières: '',
          estMotifAchèvement: true,
          dateTransmissionAuCocontractant: '',
          estMotifAbandon: false,
          dateAbandonAccordé: '',
          estAccordée: true,
          dateMainlevée: '',
          cahierDesChargesReference: '',
        },
      };
    case 'mise-en-demeure':
      return {
        type,
        data: {
          ...common,
          referenceProjet: common.refPotentiel,
          adresseProjet: common.adresseCandidat,
          emailProjet: common.email,
          dateMiseEnDemeure: '',
          contactDreal: '',
          dateLancementAppelOffre: '',
          adresseCompleteProjet: '',
          puissanceProjet: common.puissance,
          paragrapheGF: '',
          garantieFinanciereEnMois: '',
          dateFinGarantieFinanciere: '',
          dateLimiteDepotGF: '',
          cahierDesChargesReference: '',
        },
      };
    case 'actionnaire':
      return {
        type,
        data: {
          ...common,
          nouvelActionnaire: faker.person.fullName(),
          referenceParagrapheActionnaire:
            appelOffre.donnéesCourriersRéponse.texteChangementDActionnariat?.référenceParagraphe ??
            '!!!MANQUANT!!!',
          contenuParagrapheActionnaire:
            appelOffre.donnéesCourriersRéponse.texteChangementDActionnariat?.dispositions ??
            '!!!MANQUANT!!!',
          estAccordé: true,
          enCopies: [],
        },
      };
    case 'puissance':
      return {
        type,
        data: {
          ...common,
          puissanceInitiale: faker.number.float({ fractionDigits: 3 }).toString(),
          nouvellePuissance: faker.number.float({ fractionDigits: 3 }).toString(),
          puissanceActuelle: faker.number.float({ fractionDigits: 3 }).toString(),
          referenceParagraphePuissance:
            appelOffre.donnéesCourriersRéponse.texteChangementDePuissance?.référenceParagraphe ??
            '!!!MANQUANT!!!',
          contenuParagraphePuissance:
            appelOffre.donnéesCourriersRéponse.texteChangementDePuissance?.dispositions ??
            '!!!MANQUANT!!!',
          estAccordé: true,
        },
      };
    case 'délai':
      return {
        type,
        data: {
          ...common,
          referenceParagrapheAchevement:
            appelOffre.donnéesCourriersRéponse.texteDélaisDAchèvement?.référenceParagraphe ??
            '!!!MANQUANT!!!',
          contenuParagrapheAchevement:
            appelOffre.donnéesCourriersRéponse.texteDélaisDAchèvement?.dispositions ??
            '!!!MANQUANT!!!',
          dateLimiteAchevementInitiale: faker.date.recent().toLocaleDateString('fr-FR'),
          dateAchèvementDemandée: faker.date.recent().toLocaleDateString('fr-FR'),
          dateLimiteAchevementActuelle: faker.date.recent().toLocaleDateString('fr-FR'),

          demandePrecedente: 'yes',
          dateDepotDemandePrecedente: faker.date.recent().toLocaleDateString('fr-FR'),
          dateReponseDemandePrecedente: faker.date.recent().toLocaleDateString('fr-FR'),
          autreDelaiDemandePrecedenteAccorde: '',

          demandeEnDate: 'yes',
          dateDemandePrecedenteDemandée: faker.date.recent().toLocaleDateString('fr-FR'),
          dateDemandePrecedenteAccordée: faker.date.recent().toLocaleDateString('fr-FR'),

          nombreDeMoisDemandé: faker.number.int(),

          enCopies: [],
        },
      };
    default:
      throw new Error('Modèle non supporté');
  }
}
