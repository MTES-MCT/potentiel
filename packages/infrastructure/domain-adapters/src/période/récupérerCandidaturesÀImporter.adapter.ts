import { InvalidOperationError } from '@potentiel-domain/core';
import type { Période } from '@potentiel-domain/periode';
import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import {
  getDémarcheAvecDossiers,
  getDémarcheIdParDossier,
} from '@potentiel-infrastructure/dn-api-client';
import { Option } from '@potentiel-libraries/monads';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter.js';
import { cleanDétailCandidatureKeys } from '../période/helpers/cleanDétailCandidatureKeys.js';

export const récupérerCandidaturesÀImporterAdapter: Période.RécupérerCandidaturesÀImporterPort =
  async (instruction) => {
    const dossiersInvalides: Array<{
      identifiantProjet: IdentifiantProjet.RawType;
      error: string;
    }> = [];
    const dossiersValides: Array<{
      identifiantProjet: IdentifiantProjet.RawType;
      dépôt: Candidature.Dépôt.RawType;
      détails: Record<string, string>;
      instruction: Candidature.Instruction.RawType;
    }> = [];

    const {
      appelOffre,
      période,
      numéroCRE: numéroDossierDN,
    } = IdentifiantProjet.convertirEnValueType(instruction[0].identifiantProjet);

    const appelOffres = await loadAppelOffreAggregateAdapter(appelOffre);

    if (Option.isNone(appelOffres)) {
      throw new Error("Appel d'offre introuvable");
    }
    const détailPériode = appelOffres.periodes.find((p) => p.id === période);

    if (!détailPériode) {
      throw new Error('Période introuvable');
    }

    if (détailPériode.typeImport !== 'démarche-numérique') {
      throw new Error("Cette période n'est pas concernée par un import via Démarche Numérique");
    }

    const démarcheId = await getDémarcheIdParDossier(Number(numéroDossierDN));

    if (Option.isNone(démarcheId)) {
      throw new InvalidOperationError(
        `La démarche associée au dossier ${numéroDossierDN} est introuvable`,
      );
    }

    const dossiers = await getDémarcheAvecDossiers({
      démarcheId: démarcheId,
    });

    for (const { identifiantProjet, ...instructionDossier } of instruction) {
      const { numéroCRE } = IdentifiantProjet.convertirEnValueType(identifiantProjet);
      const dossierValide = dossiers.dépôtsValides.find((d) => d.numeroDN === Number(numéroCRE));
      if (dossierValide) {
        dossiersValides.push({
          dépôt: dossierValide.dépôt,
          détails: cleanDétailCandidatureKeys(dossierValide.détails),
          instruction: instructionDossier,
          identifiantProjet: identifiantProjet,
        });
      } else {
        const dossierInvalide = dossiers.dépôtsInvalides.find(
          (d) => d.numeroDN === Number(numéroCRE),
        );
        dossiersInvalides.push({
          identifiantProjet: identifiantProjet,
          error: dossierInvalide ? `Le dépôt est invalide` : `Le dossier n'a pas été trouvé`,
        });
      }
    }
    return { démarcheId: démarcheId.toString(), dossiersInvalides, dossiersValides };
  };
