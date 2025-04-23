-- delete subscribers
delete from event_store.subscriber
where stream_category = 'lauréat';


--
-- Run migration
-- scalingo run --app potentiel-production --region osc-secnum-fr1 potentiel-cli cahierdescharges migrer
--

-- delete pending ack
delete from event_store.pending_acknowledgement
where stream_category = 'lauréat'
    and subscriber_name = 'dead-letter-queue';

--
-- Restart app
-- scalingo restart --app potentiel-production --region osc-secnum-fr1
--

-- rebuild
call event_store.rebuild('lauréat');


-- Sanity check
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    p."cahierDesChargesActuel" as valeur_projet,
    laur.value->>'cahierDesCharges' as valeur_migrée -- array_agg(es.payload) as events_legacy,
    -- array_agg(es2.payload) as events_new
from projects p
    left join domain_views.projection laur on format(
        'lauréat|%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) = laur.key
    left join "eventStores" es on es.payload->>'projetId' = p.id::text
    and es.type = 'CahierDesChargesChoisi'
    left join event_store.event_stream es2 on es2.stream_id = format('lauréat|%s', laur.value->>'identifiantProjet')
    and es2.type = 'CahierDesChargesChoisi-V1'
where (1 = 1)
    and (
        laur.value->>'cahierDesCharges' is null
        or laur.value->>'cahierDesCharges' <> p."cahierDesChargesActuel"
    )
    and p.classe = 'Classé'
group by format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ),
    p."cahierDesChargesActuel",
    laur.value->>'cahierDesCharges'
order by 2,
    3;


select laur.value->>'cahierDesCharges',
    count(*)
from domain_views.projection laur
where key LIKE 'lauréat|%'
group by laur.value->>'cahierDesCharges'
order by 1;

select "cahierDesChargesActuel",
    count(*)
from projects p
where p.classe = 'Classé'
group by "cahierDesChargesActuel"
order by 1;