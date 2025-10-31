import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const computeProjetLauréatParDépartement = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.carto_projet_statistic
    select laur.value->>'identifiantProjet' as "identifiant",
      laur.value->>'appelOffre' as "appelOffre",
      DATE((laur.value->>'notifiéLe')::timestamp) as "dateNotification",
      laur.value->>'localité.département' as "departementProjet",
      (
        case
          when candidature.value->>'actionnariat' = 'financement-participatif' then TRUE
          else FALSE
        end
      ) as "isFinancementParticipatif",
      (
        case
          when candidature.value->>'actionnariat' = 'investissement-participatif' then TRUE
          else FALSE
        end
      ) as "isInvestissementParticipatif",
      (puiss.value->>'puissance')::float as "puissance"
    from domain_views.projection laur
      inner join domain_views.projection puiss on puiss.key = format('puissance|%s', laur.value->>'identifiantProjet')
      inner join domain_views.projection candidature on candidature.key = format(
        'candidature|%s',
        laur.value->>'identifiantProjet'
      )
      left join domain_views.projection abandon on abandon.key = format('abandon|%s', laur.value->>'identifiantProjet')
      and abandon.value->>'statut' = 'accordé'
    where laur.key like 'lauréat|%'
      and abandon.key is null;
    `,
  );
};
