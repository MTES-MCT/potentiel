import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';

import { Command, Flags } from '@oclif/core';
import { fakerFR as faker } from '@faker-js/faker';

import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

const types = ['abandon', 'recours', 'mainlevée', 'mise-en-demeure', 'actionnaire'] as const;
export type TypeDocument = ModèleRéponseSignée.GénérerModèleRéponseOptions['type'];

export default class GénérerDocument extends Command {
  static override description = 'Modifier GRD depuis un CSV';

  static override flags = {
    type: Flags.option({ options: [...types] })({ required: true }),
    logo: Flags.string(),
  };

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { flags } = await this.parse(GénérerDocument);

    const readableStream = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      logo: flags.logo,
      ...getData(flags.type),
    });

    const outputPath = path.join(__dirname, `${flags.type}.docx`);
    const writableStream = fs.createWriteStream(outputPath);

    const nodeReadableStream = Stream.Readable.from(readableStream);
    nodeReadableStream.pipe(writableStream);

    writableStream.on('finish', () => {
      console.info('Le fichier a été écrit avec succès:', outputPath);
    });
  }
}

const getData = (type: TypeDocument): ModèleRéponseSignée.GénérerModèleRéponseOptions => {
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
    default:
      throw new Error('Modèle non supporté');
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
  }
};
