import { extname } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { contentType } from 'mime-types';

import { DateTime, Email } from '@potentiel-domain/common';
import { Candidature, Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import { copyFile, fileExists, upload } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

type CandidatureEvents = {
  stream_id: string;
  details: [{ kind: null; name: null }] | { kind: string; name: string }[];
  identifiantProjet: IdentifiantProjet.RawType;
  évaluationCarboneSimplifiée: number;
};

const eventQuery = `
SELECT es.stream_id,
    payload->>'identifiantProjet' AS "identifiantProjet",
    payload->>'evaluationCarboneSimplifiée' AS "évaluationCarboneSimplifiée",
    json_agg(
        jsonb_build_object(
            'kind', d.key,
            'name', d.value
        )
    ) as details
FROM event_store.event_stream es
INNER JOIN projects p ON format(
    '%s#%s#%s#%s',
    p."appelOffreId",
    p."periodeId",
    p."familleId",
    p."numeroCRE"
) = payload->>'identifiantProjet'
LEFT JOIN json_each_text(p.details) d ON (d.key ILIKE '%nom du fabricant%'
    AND trim(lower(d.value)) NOT IN ('','0','#n/a','n/a','na','n.a.','nx','nc','ne s''applique pas','non applicable', 'non concerné','-','--','/','sans objet','s/o','so', 'non pertinent', 'non applicable à ce projet','non disponible','aucun','non','non concern?','_','à définir ultérieurement','b','non défini','non renseigné','non précisé', 'non connu à ce jour', 'non connu a ce jour')) OR  d.key ILIKE '%Lieu(x) de fabrication%'
WHERE es.type = 'CandidatureImportée-V1'
GROUP BY es.stream_id,
    payload->>'identifiantProjet', payload->>'evaluationCarboneSimplifiée';
`;

type LauréatEvents = {
  identifiantProjet: IdentifiantProjet.RawType;
  notifiéLe: DateTime.RawType;
  notifiéPar: Email.RawType;
};
const lauréatEventQuery = `
WITH RankedEvents AS (
  SELECT payload->>'identifiantProjet' AS "identifiantProjet",
      payload->>'notifiéPar' AS "notifiéPar",
      payload->>'notifiéLe' AS "notifiéLe",
      ROW_NUMBER() OVER (
          PARTITION BY payload->>'identifiantProjet'
          ORDER BY payload->>'notifiéLe' DESC
      ) AS row_num
  FROM event_store.event_stream es
  WHERE es.type IN ('LauréatNotifié-V2', 'LauréatNotifié-V1')
)
SELECT row_num,
  "identifiantProjet",
  "notifiéPar",
  "notifiéLe"
FROM RankedEvents
where row_num=1;
`;

type ModificationsEvents = {
  identifiantProjet: IdentifiantProjet.RawType;
  fournisseurs: Array<{ kind: string; name: string }>;
  evaluationCarbone: number | null;
  enregistréLe: DateTime.RawType;
  enregistréPar: Email.RawType;
  raison: string;
  filePath: string | null;
};
const modificationsQuery = `
select 
  concat(p."appelOffreId", '#', p."periodeId", '#', p."familleId", '#', p."numeroCRE") as "identifiantProjet",
  es.payload->'fournisseurs' as "fournisseurs",
  es.payload->'evaluationCarbone' as "evaluationCarbone",
  (SELECT to_char (es."occurredAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "enregistréLe",
  u."email" as "enregistréPar",
  es.payload->>'justification' as "raison",
  replace(replace(f."storedAt", 'S3:potentiel-production:', ''), 'S3:production-potentiel:', '') as "filePath"
from "eventStores" es
  inner join projects p on es.payload->>'projectId' = p.id::text
  inner join users u on es.payload->>'requestedBy' = u.id::text
  left join files f on es.payload->>'fileId' = f.id::text
where 
        es.type like 'Modification%'
  and   payload->>'type' = 'fournisseur'
order by es."occurredAt" asc;
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async finally() {
    await killPool();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const stats = {
      nbCandidaturesMigrées: 0,
      nbFournisseursImportés: 0,
      nbModifications: 0,
      nbFichiersCopiés: 0,
      nbFichiersCréés: 0,
      nbErreursCopie: 0,
      nbModificationIgnorées: 0,
    };
    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='candidature' or stream_category='fournisseur'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn('Il existe des subscribers pour candidature ou fournisseur');
      process.exit(1);
    }

    // Step 1 - Mise à jour Candidature

    console.log('migration des candidatures...');
    const candidaturesImportéesEvent = await executeSelect<CandidatureEvents>(eventQuery);

    console.log(`${candidaturesImportéesEvent.length} candidatures importées trouvées`);

    for (const { stream_id, identifiantProjet, details } of candidaturesImportéesEvent) {
      process.stdout.write('.');

      const fournisseurs = mapDetailsToFournisseurs(
        details.filter((x) => x.name !== null && x.kind !== null),
      );

      if (fournisseurs.length === 0) {
        continue;
      }

      const event: Candidature.DétailsFournisseursCandidatureImportésEvent = {
        type: 'DétailsFournisseursCandidatureImportés-V1',
        payload: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          fournisseurs,
        },
      };

      if (flags.dryRun) {
        // console.log(`[DRY-RUN] Publishing ${event.type} for ${stream_id}`);
      } else {
        await publish(stream_id, event);
        console.log(`Published ${event.type} for ${stream_id}`);
      }
      stats.nbCandidaturesMigrées++;
    }

    // Step 2 - Import Fournisseur pour les lauréats

    console.log();
    console.log('migration des imports...');
    const lauréatNotifiéEvents = await executeSelect<LauréatEvents>(lauréatEventQuery);

    console.log(`${lauréatNotifiéEvents.length} lauréats trouvés`);

    for (const { notifiéPar, notifiéLe, identifiantProjet } of lauréatNotifiéEvents) {
      process.stdout.write('.');

      const candidature = candidaturesImportéesEvent.find(
        (candidature) => candidature.identifiantProjet === identifiantProjet,
      );

      if (!candidature) {
        console.warn(`Pas de candidature trouvée pour l'identifiant ${identifiantProjet}`);
        continue;
      }

      const fournisseurs = mapDetailsToFournisseurs(
        candidature.details.filter((x) => x.name !== null && x.kind !== null),
      );

      // Le détail fournisseur n'a jamais été corrigé lors d'une correction de candidature
      // cf : select distinct json_object_keys(payload->'correctedData') from "eventStores" es where es.type='ProjectDataCorrected';
      // la valeur évaluationCarboneSimplifiée n'a jamais été corrigée donc on peut utiliser celle de l'import
      const event: Lauréat.Fournisseur.FournisseurImportéEvent = {
        type: 'FournisseurImporté-V1',
        payload: {
          fournisseurs,
          évaluationCarboneSimplifiée: Number(candidature.évaluationCarboneSimplifiée),
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          importéLe: notifiéLe,
          importéPar: notifiéPar,
        },
      };

      if (flags.dryRun) {
        // console.log(`[DRY-RUN] Publishing ${event.type} for ${identifiantProjet}`);
      } else {
        await publish(`fournisseur|${identifiantProjet}`, event);
        console.log(`Published ${event.type} for ${identifiantProjet}`);
      }
      stats.nbFournisseursImportés++;
    }

    const tousLesFournisseurs = lauréatNotifiéEvents.map(({ identifiantProjet }) =>
      mapDetailsToFournisseurs(
        candidaturesImportéesEvent
          .find((candidature) => candidature.identifiantProjet === identifiantProjet)
          ?.details.filter((x) => x.name !== null && x.kind !== null) ?? [],
      ),
    );

    // Step 3 - Modifications

    console.log('migration des modifications...');
    const modifications = await executeSelect<ModificationsEvents>(modificationsQuery);
    const fichiersÀCopier: Array<{
      filePath: string | undefined;
      target: DocumentProjet.ValueType;
    }> = [];

    let matchFournisseurNom = 0;
    let changementFournisseur = 0;

    for (const modification of modifications) {
      process.stdout.write('.');
      if (
        !modification.fournisseurs?.length &&
        (modification.evaluationCarbone === null || modification.evaluationCarbone === undefined) &&
        (modification.filePath === null || modification.filePath === undefined)
      ) {
        console.log(`Skipping empty modifification for ${modification.identifiantProjet}`);
        stats.nbModificationIgnorées++;
        continue;
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        modification.identifiantProjet,
      );
      const enregistréLe = DateTime.convertirEnValueType(modification.enregistréLe);
      const fournisseurs = modification.fournisseurs
        ? mapDetailsToFournisseurs(modification.fournisseurs)
        : undefined;

      // since the modification doesn't contain
      if (fournisseurs && fournisseurs.length > 0) {
        const candidature = candidaturesImportéesEvent.find(
          (candidature) => candidature.identifiantProjet === modification.identifiantProjet,
        )!;
        const fournisseursCandidature = mapDetailsToFournisseurs(
          candidature.details.filter((x) => x.name !== null && x.kind !== null),
        );
        fournisseurs.forEach((value) => {
          const fournisseurCandidature = fournisseursCandidature.find(
            (x) => x.nomDuFabricant === value.nomDuFabricant,
            // x.typeFournisseur === value.typeFournisseur,
          );
          if (fournisseurCandidature) {
            value.lieuDeFabrication = fournisseurCandidature.lieuDeFabrication;
            matchFournisseurNom++;
          } else {
            const fournisseurCandidature = fournisseursCandidature.find(
              (x) => x.typeFournisseur === value.typeFournisseur,
            );
            if (fournisseurCandidature) {
              console.log(fournisseurCandidature.nomDuFabricant, '=>', value.nomDuFabricant);
            } else {
              console.log(fournisseursCandidature, fournisseurs);
            }
          }
        });
        changementFournisseur++;
      }

      const event: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent = {
        type: 'ChangementFournisseurEnregistré-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          fournisseurs,
          évaluationCarboneSimplifiée: modification.evaluationCarbone ?? undefined,
          raison: modification.raison,
          enregistréLe: enregistréLe.formatter(),
          enregistréPar: Email.convertirEnValueType(modification.enregistréPar).formatter(),
          pièceJustificative: {
            format:
              (modification.filePath && contentType(extname(modification.filePath))) ||
              'application/pdf',
          },
        },
      };

      if (flags.dryRun) {
        // console.log(`[DRY-RUN] Publishing ${event.type} for ${identifiantProjet}`);
      } else {
        await publish(`fournisseur|${identifiantProjet.formatter()}`, event);
        console.log(`Published ${event.type} for ${identifiantProjet}`);
      }

      fichiersÀCopier.push({
        filePath: modification.filePath ?? undefined,
        target: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
          enregistréLe.formatter(),
          (modification.filePath && contentType(extname(modification.filePath))) ||
            'application/pdf',
        ),
      });
      stats.nbModifications++;
    }

    console.log(
      'projets avec 0 fournisseur',
      tousLesFournisseurs.filter((fournisseurs) => fournisseurs.length === 0).length,
    );
    console.log(
      'projets avec 1 fournisseur',
      tousLesFournisseurs.filter((fournisseurs) => fournisseurs.length === 1).length,
    );
    console.log(
      'projets avec 2 fournisseurs',
      tousLesFournisseurs.filter((fournisseurs) => fournisseurs.length === 2).length,
    );
    console.log(
      'projets avec 3 fournisseurs',
      tousLesFournisseurs.filter((fournisseurs) => fournisseurs.length === 3).length,
    );
    console.log(
      'projets avec 4+ fournisseurs',
      tousLesFournisseurs.filter((fournisseurs) => fournisseurs.length > 3).length,
    );

    console.log(
      'fournisseurs sans lieu',
      tousLesFournisseurs.flat().filter((f) => !f.lieuDeFabrication).length,
    );
    console.log(
      'fournisseurs complets',
      tousLesFournisseurs
        .flat()
        .filter((f) => f.typeFournisseur && f.nomDuFabricant && f.lieuDeFabrication).length,
    );

    console.log({ matchFournisseurNom, changementFournisseur });

    console.log('');
    console.log('migration des fichiers...');
    for (const { filePath, target } of fichiersÀCopier) {
      process.stdout.write('.');
      try {
        if (filePath) {
          if (flags.dryRun) {
            const exists = await fileExists(filePath);
            if (!exists) {
              throw new Error('File does not exist');
            }
          } else {
            await copyFile(filePath, target.formatter());
          }
          stats.nbFichiersCopiés++;
        } else {
          const doc = await getReplacementDoc(
            "Fichier généré automatiquement en l'absence de pièces justificatives",
          );
          if (!flags.dryRun) {
            await upload(target.formatter(), doc);
          }
          stats.nbFichiersCréés++;
        }
      } catch (error) {
        console.error(error);
        stats.nbErreursCopie++;
      }
    }
    console.log();
    console.log('migration terminée');
    console.log(stats);
  }
}

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': `Dispositifs de stockage de l'énergie *`,
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil *',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, Lauréat.Fournisseur.TypeFournisseur.RawType>;

const regex = /(?<field>.*)\s?\s\((?<type>.*)\)\s?(?<index>\d?)/;
const mapCsvLabelToFournisseur = (typeValue: string) => {
  const { type, index, field } = typeValue.match(regex)?.groups ?? {};
  const typeNormalisé = type.replaceAll('’', "'");
  if (type && labelCsvToTypeFournisseur[typeNormalisé]) {
    return {
      type: Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
        labelCsvToTypeFournisseur[typeNormalisé],
      ).formatter(),
      field,
      index: index ? Number(index) : 0,
    };
  }
  throw new Error(`Type inconnu (${type})`);
};
const mapDetailsToFournisseurs = (details: { name: string; kind: string }[]) => {
  const detailsFields = details
    .map(({ name, kind }) => ({
      ...mapCsvLabelToFournisseur(kind),
      valeur: name,
    }))
    .filter((item) => item !== undefined);

  if (detailsFields.length === 0) return [];

  return detailsFields
    .reduce(
      (prev, curr) => {
        prev[curr.index] ??= {
          typeFournisseur: curr.type,
          nomDuFabricant: '',
          lieuDeFabrication: '',
        };
        if (
          curr.field.trim() === 'Lieu(x) de fabrication' &&
          !['non concerné', 'Sans objet', 'N/A', 'NC', 'Non applicable', 'nc'].includes(curr.valeur)
        ) {
          prev[curr.index].lieuDeFabrication = curr.valeur;
        }
        if (curr.field.trim() === 'Nom du fabricant') {
          prev[curr.index].nomDuFabricant = curr.valeur;
        }
        return prev;
      },
      new Array<{
        typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
        lieuDeFabrication: string;
        nomDuFabricant: string;
      }>(Math.max(...detailsFields.map((x) => x.index)) || 1),
    )
    .filter((x) => !!x.typeFournisseur && !!x.nomDuFabricant);
};

const getReplacementDoc = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 14;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  page.drawText(text, {
    x: page.getWidth() / 2 - textWidth / 2,
    y: (2 / 3) * page.getHeight() - textHeight / 2,
    size: textSize,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes], { type: 'application/pdf' }).stream();
};
