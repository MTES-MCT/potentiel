import { readdir, readFile } from 'node:fs/promises';
import path from 'path';

import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { registerDocumentProjetCommand } from '@potentiel-domain/document';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

if (!process.env.DIRECTORY_PATH) {
  console.error(`La variable d'environnement DIRECTORY_PATH n'est pas définie.`);
  process.exit(1);
}

if (!process.env.EVENT_STORE_CONNECTION_STRING) {
  console.error(`La variable d'environnement EVENT_STORE_CONNECTION_STRING n'est pas définie.`);
  process.exit(1);
}

GarantiesFinancières.registerGarantiesFinancièresUseCases({
  loadAggregate,
});

GarantiesFinancières.registerGarantiesFinancièresQueries({
  find: findProjection,
  list: listProjection,
});

registerDocumentProjetCommand({
  enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
  déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
  archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
});

(async () => {
  try {
    const directoryPath = process.env.DIRECTORY_PATH!;
    const dirrents = await readdir(directoryPath, {
      withFileTypes: true,
    });

    type Statistics = {
      attestationAjoutée: number;
      gfCréeEtAttestationAjoutée: number;
      attestationExistante: number;
    };
    const statistics: Statistics = {
      attestationAjoutée: 0,
      gfCréeEtAttestationAjoutée: 0,
      attestationExistante: 0,
    };

    console.log('Contenu du dossier :');

    for (const file of dirrents) {
      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.pdf') {
        continue;
      }

      console.log('📝 File', file.name);

      const fileName = path.basename(file.name, '.pdf');

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(fileName);

      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isSome(gf) && gf.garantiesFinancières.attestation) {
        console.log(`Le projet ${identifiantProjet.formatter()} a déjà une attestation`);
        statistics.attestationExistante++;
        continue;
      }

      const filePath = path.join(directoryPath, file.name);
      const fileBuffer = await readFile(filePath);
      const content = new ReadableStream({
        start: async (controller) => {
          controller.enqueue(fileBuffer);
          controller.close();
        },
      });

      const enregistréParValue = Email.convertirEnValueType(
        'contact@potentiel.beta.gouv.fr',
      ).formatter();

      if (Option.isNone(gf)) {
        await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
          type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            typeValue: GarantiesFinancières.TypeGarantiesFinancières.typeInconnu.type,
            dateConstitutionValue: DateTime.now().formatter(), // Quelle date mettre ici ?
            attestationValue: {
              content,
              format: 'application/pdf',
            },
            enregistréLeValue: DateTime.now().formatter(),
            enregistréParValue,
          },
        });
        statistics.gfCréeEtAttestationAjoutée++;
        console.log(
          `Garanties financières du projet ${identifiantProjet.formatter()} crée avec l'attestation`,
        );
        continue;
      }

      await mediator.send<GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateConstitutionValue:
            gf.garantiesFinancières.dateConstitution?.formatter() ?? DateTime.now().formatter(),
          attestationValue: {
            content,
            format: 'application/pdf',
          },
          enregistréLeValue: DateTime.now().formatter(),
          enregistréParValue,
        },
      });
      statistics.attestationAjoutée++;
      console.log(`Attestation du projet ${identifiantProjet.formatter()} enregistrée`);
    }

    console.log('\n\nStatistiques :');
    console.log(
      `Nombre d'attestation ajoutées à des gfs existante : ${statistics.attestationAjoutée}`,
    );
    console.log(`Nombre de gf crées avec attestation : ${statistics.gfCréeEtAttestationAjoutée}`);
    console.log(`Nombre d'attestation déjà existante : ${statistics.attestationExistante}`);
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
