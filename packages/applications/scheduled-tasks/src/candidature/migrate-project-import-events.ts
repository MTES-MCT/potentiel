import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type ProjectRawDataImportedPayload = {
  periodeId: string;
  appelOffreId: string;
  familleId: string;
  territoireProjet: string;
  numeroCRE: string;
  nomCandidat: string;
  actionnaire: string;
  nomProjet: string;
  puissance: number;
  prixReference: number;
  evaluationCarbone: number;
  note: number;
  nomRepresentantLegal: string;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
  engagementFournitureDePuissanceAlaPointe: boolean;
  email: string;
  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  classe: string;
  motifsElimination: string;
  notifiedOn: number;
  details: Record<string, string>;
  technologie: string;
  actionnariat?: string;
  garantiesFinancièresType?: string;
  garantiesFinancièresDateEchéance?: string;
  désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
  historiqueAbandon?:
    | 'première-candidature'
    | 'abandon-classique'
    | 'abandon-avec-recandidature'
    | 'lauréat-autre-période';
};

(async () => {
  console.info('Lancement du script...');

  const query = `
    select payload->'data'->>'nomProjet' as "nom_projet", 
        payload->'data'->>'appelOffreId' as "appel_offre", 
        payload->'data'->>'periodeId' as "periode", 
        payload->'data'->>'familleId' as "famille", 
        payload->'data'->>'numeroCRE' as "numero_cre", 
        count(id) as "total_import",
        array_agg(id) as "event_ids" 
    from "eventStores" es 
    where type = 'ProjectRawDataImported'
    group by payload->'data'->>'nomProjet', 
            payload->'data'->>'appelOffreId', 
            payload->'data'->>'periodeId', 
            payload->'data'->>'familleId', 
            payload->'data'->>'numeroCRE'
    LIMIT 100;
  `;

  try {
    const result = await executeSelect<{
      nom_projet: string;
      appel_offre: string;
      periode: string;
      famille: string;
      numero_cre: string;
      total_import: number;
      event_ids: string[];
    }>(query);

    for (const { nom_projet, appel_offre, periode, famille, numero_cre, event_ids } of result) {
      const identifiantProjet = `${appel_offre}#${periode}#${famille}#${numero_cre}`;

      console.info(
        `Will migrate ${event_ids.length} events from project ${nom_projet} with id=[${identifiantProjet}]`,
      );

      const query = `
        select payload->'data' as data
        from "eventStores" es
        where id = any($1)
        order by "createdAt" asc;
        `;

      const events = await executeSelect<{
        data: ProjectRawDataImportedPayload;
      }>(query, event_ids);

      const payload = events.reduce(
        (acc, { data }) => {
          const result: Candidature.CandidatureImportéeEvent['payload'] = {
            ...acc,
            // regionProjet: string;
            // désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
            identifiantProjet:
              IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
            statut: data.classe === 'Classé' ? 'classé' : 'éliminé',
            typeGarantiesFinancières: (data.garantiesFinancièresType ??
              'type-inconnu') as GarantiesFinancières.TypeGarantiesFinancières.RawType,
            historiqueAbandon: data.historiqueAbandon,
            appelOffre: data.appelOffreId,
            période: data.periodeId,
            famille: data.familleId,
            numéroCRE: data.numeroCRE,
            nomProjet: data.nomProjet,
            sociétéMère: data.actionnaire,
            nomCandidat: data.nomCandidat,
            puissanceProductionAnnuelle: data.puissance,
            prixReference: data.prixReference,
            noteTotale: data.note,
            nomReprésentantLégal: data.nomRepresentantLegal,
            emailContact: data.email,
            adresse1: data.adresseProjet,
            adresse2: '',
            codePostal: data.codePostalProjet,
            commune: data.communeProjet,
            motifÉlimination: data.motifsElimination,
            puissanceALaPointe: data.engagementFournitureDePuissanceAlaPointe,
            evaluationCarboneSimplifiée: data.evaluationCarbone,
            valeurÉvaluationCarbone: data.evaluationCarbone,
            technologie:
              data.technologie as Candidature.CandidatureImportéeEvent['payload']['technologie'],
            financementCollectif: data.actionnariat === 'financement-collectif',
            financementParticipatif: data.isInvestissementParticipatif,
            gouvernancePartagée: data.actionnariat === 'gouvernance-partagée',
            dateÉchéanceGf: data.garantiesFinancièresDateEchéance
              ? DateTime.convertirEnValueType(
                  new Date(data.garantiesFinancièresDateEchéance),
                ).formatter()
              : undefined,
            teritoireProjet: data.territoireProjet,
            détails: data.details,
          };

          return result;
        },
        {} as Candidature.CandidatureImportéeEvent['payload'],
      );

      console.info(`This event will be created :`);
      console.info(JSON.stringify(payload));

      await publish(`candidature|${identifiantProjet}`, {
        type: 'CandidatureImportée-V1',
        payload,
      });
    }

    console.info('Fin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
