import { mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import type { Période } from '../../index.js';
import type { RécupérerCandidaturesÀImporterPort } from '../../port/index.js';
import { IdentifiantPériode, type ImportPériodeInitiéEvent } from '../../période.js';

export const handleImportPériodeInitié = async (
  { payload: { initiéLe, initiéPar, instruction, identifiantPériode } }: ImportPériodeInitiéEvent,
  récupérerCandidaturesÀImporter: RécupérerCandidaturesÀImporterPort,
) => {
  const typeImport: AppelOffre.Periode['typeImport'] = 'démarche-numérique';
  const errors: Array<{ identifiantProjet: IdentifiantProjet.RawType; error: string }> = [];

  const dossiers = await récupérerCandidaturesÀImporter(instruction);

  for (const dossier of dossiers.dossiersValides) {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(dossier.identifiantProjet);
    try {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dépôtValue: Candidature.Dépôt.convertirEnValueType(dossier.dépôt).formatter(),
          détailsValue: {
            ...dossier.détails,
            typeImport,
            demarcheId: dossiers.démarcheId.toString(),
          },
          instructionValue: Candidature.Instruction.convertirEnValueType(
            dossier.instruction,
          ).formatter(),
          importéLe: initiéLe,
          importéPar: initiéPar,
        },
      });
    } catch (error) {
      errors.push({
        identifiantProjet: identifiantProjet.formatter(),
        error: error instanceof Error ? error.message : "Impossible d'importer la candidature",
      });
    }
  }

  await mediator.send<Période.ImporterPériodeCommand>({
    type: 'Période.Command.ImporterPériode',
    data: {
      identifiantPériode: IdentifiantPériode.convertirEnValueType(identifiantPériode),
      importéLe: DateTime.now(),
      importéPar: Email.convertirEnValueType(initiéPar),
      projetsEnErreur: dossiers.dossiersInvalides.concat(errors).map((p) => ({
        identifiantProjet: IdentifiantProjet.convertirEnValueType(p.identifiantProjet),
        motif: p.error,
      })),
    },
  });
};
