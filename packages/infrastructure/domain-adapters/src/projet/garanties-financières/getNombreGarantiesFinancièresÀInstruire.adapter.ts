import type { Lauréat } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type GetNombreGarantiesFinancièresÀInstruireRow = {
  enAttenteTotal: number;
  dépôtsTotal: number;
  dépôtsNew: number;
  mainlevéeTotal: number;
  mainlevéeNew: number;
};

const estEnAttente = `(
  p.value->>'statut' IN ('non-déposé', 'échu')
  AND p.value->>'enAttente.motif' IS NOT NULL
  AND p.value->>'dépôt.soumisLe' IS NULL
  AND laur.value->>'statut' = 'actif'
)`;

const aUnDépôt = `(p.value->>'dépôt.soumisLe' IS NOT NULL)`;

const query = `
  SELECT
    gf."enAttenteTotal",
    gf."dépôtsTotal",
    gf."dépôtsNew",
    mainlevée."mainlevéeTotal",
    mainlevée."mainlevéeNew"
  FROM
  (
    SELECT
      count(*) FILTER (WHERE ${estEnAttente})::int AS "enAttenteTotal",
      count(*) FILTER (WHERE ${aUnDépôt})::int AS "dépôtsTotal",
      count(*) FILTER (WHERE ${aUnDépôt} AND p.value->>'dépôt.soumisLe' > $1)::int AS "dépôtsNew"
    FROM domain_views.projection p
    JOIN domain_views.projection laur
      ON laur.key = 'lauréat|' || (p.value->>'identifiantProjet')
    WHERE p.key LIKE 'garanties-financieres|%'
      AND laur.value->>'localité.région' = ANY($2)
  ) gf,
  (
    SELECT
      count(*)::int AS "mainlevéeTotal",
      count(*) FILTER (WHERE p.value->>'demande.demandéeLe' > $1)::int AS "mainlevéeNew"
    FROM domain_views.projection p
    JOIN domain_views.projection laur
      ON laur.key = 'lauréat|' || (p.value->>'identifiantProjet')
    WHERE p.key LIKE 'mainlevee-garanties-financieres|%'
      AND p.value->>'statut' IN ('demandé', 'en-instruction')
      AND laur.value->>'localité.région' = ANY($2)
  ) mainlevée
`;

export const getNombreGarantiesFinancièresÀInstruireAdapter: Lauréat.GarantiesFinancières.GetNombreDeGarantiesFinancièresÀInstruirePort =
  async (date, régions) => {
    const [row] = await executeSelect<GetNombreGarantiesFinancièresÀInstruireRow>(
      query,
      date,
      régions,
    );

    return {
      projetEnAttente: {
        total: row?.enAttenteTotal ?? 0,
      },
      dépôts: {
        total: row?.dépôtsTotal ?? 0,
        new: row?.dépôtsNew ?? 0,
      },
      demandeMainlevée: {
        total: row?.mainlevéeTotal ?? 0,
        new: row?.mainlevéeNew ?? 0,
      },
    };
  };
