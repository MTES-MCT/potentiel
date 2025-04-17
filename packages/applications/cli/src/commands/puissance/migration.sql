-- delete subscribers
delete from event_store.subscriber
where stream_category = 'puissance';


--
-- Run migration
-- scalingo run --app potentiel-production --region osc-secnum-fr1 potentiel-cli puissance migrer
--

-- delete pending ack
delete from event_store.pending_acknowledgement
where stream_category = 'puissance'
    and subscriber_name = 'dead-letter-queue';

--
-- Restart app
-- scalingo restart --app potentiel-production --region osc-secnum-fr1
--

-- rebuild
call event_store.rebuild('puissance');


select *
from event_store.pending_acknowledgement;

-- Sanity check
select format(
        'https://potentiel.beta.gouv.fr/projet/%s/details.html',
        p."id"
    ),
    format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    p.puissance,
    puiss.value->'puissance' "puissance migrée",
    p."abandonedOn",
    json_agg(es.*)
from projects p
    left join domain_views.projection puiss on puiss.key = format(
        'puissance|%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    )
    left join "eventStores" es on es.payload->>'projectId' = p.id::text
    and es.type = 'ProjectDataCorrected'
    and es.payload->'correctedData'->>'puissance' is not null
where p.classe = 'Classé'
    and (
        p.puissance::text <> (puiss.value->>'puissance')
        or puiss.key is null
    )
group by p.id,
    puiss.key;