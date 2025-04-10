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


-- Correction des puissances modifiées par erreur lors de modifiations de la candidature
update projects
set puissance = 4.6035
where id = 'd8bfc6e4-555d-49b7-b89a-1a2ac6008587';
update projects
set puissance = 1.51536
where id = '7cdec126-664d-46da-9e75-752bc1bd65fe';
update projects
set puissance = 4.79196
where id = 'a9695284-2401-4040-8def-4204b5f05710';
update projects
set puissance = 3.54
where id = 'f971df74-d150-4d6e-8357-904f965daefd';
update projects
set puissance = 10.0944
where id = '0a664e3c-8734-4cb9-a125-f0b65828bb75';
update projects
set puissance = 2.42034
where id = 'de4be1e8-34f0-4698-9868-5d7bd648cfd7';
update projects
set puissance = 3.6288
where id = '4c423a5b-02b8-482e-9164-4d887934fc87';
update projects
set puissance = 3.25728
where id = 'c0193b9a-0bc2-447d-a909-51a5e14d5850';
update projects
set puissance = 11.38891
where id = '03db7b6b-84d8-43f3-9d3e-372d084d60eb';
update projects
set puissance = 2.5839
where id = 'd2276636-feb5-4685-9d82-d590c7e0a3f2';





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




----
----
----
-- list modifications before migration
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    mr.status,
    mr.puissance,
    mr.justification,
    mr."requestedOn",
    u.email,
    mr."cancelledOn",
    u_cancel.email as "cancelledBy",
    u_respond.email as "respondedBy",
    mr.authority,
    p."abandonedOn",
    format(
        'https://potentiel.beta.gouv.fr/projet/%s/details.html',
        p."id"
    )
from "modificationRequests" mr
    inner join projects p on p.id = mr."projectId"
    left join users u on u.id = mr."userId"
    left join users u_cancel on u_cancel.id = mr."cancelledBy"
    left join users u_respond on u_respond.id = mr."respondedBy"
where mr.type = 'puissance';


-- list admin changes
select p.id,
    format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    es.payload->'correctedData'->>'puissance' as "puissance",
    p.puissance as "puissance actuelle",
    (
        select puissance
        from "modificationRequests" mr
        where mr."projectId" = p.id
            and mr.status in ('acceptée', 'information validée')
        order by mr."respondedOn" desc
        limit 1
    ) as "lastAcceptedModificationRequest",
    es.payload->'correctedData'->>'puissance'::text = p.puissance::text,
    u.email as "correctedBy",
    es."createdAt" as "correctedOn",
    es.payload
from "eventStores" es
    inner join users u on u.id = (es."payload"->>'correctedBy')::uuid
    inner join projects p on p.id = (es.payload->>'projectId')::uuid
where es.type = 'ProjectDataCorrected'
    and es.payload->'correctedData'->>'puissance' is not null
    and es.payload->'correctedData'->>'puissance'::text = p.puissance::text
order by es."createdAt";


select mr.status,
    count(*)
from "modificationRequests" mr
where mr.type = 'puissance'
group by mr.status
order by 2 desc;

-- "status","count"
-- "information validée","1409"
-- "acceptée","45"
-- "annulée","37"
-- "envoyée","19"
-- "en instruction","11"
-- "rejetée","9"
select value->>'demande.statut',
    count(*)
from domain_views.projection
where key LIKE 'changement-puissance|%'
GROUP BY value->>'demande.statut';



-- cas particulier modificationRequest non trouvée
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    es."occurredAt",
    u.email as "requestedBy",
    es.payload->'puissance' as "puissance",
    es.payload->'fileId' as "fileId",
    es.payload->'authority' as "authority",
    es.type
from "eventStores" es
    inner join users u on u.id = (es."payload"->>'requestedBy')::uuid
    inner join projects p on p.id = (es.payload->>'projectId')::uuid
where (
        es.type in ('ModificationReceived', 'ModificationRequested')
        and es.payload->>'type' = 'puissance'
    );



 -- "url","puissance","puissance migrée","abandonedOn"
-- "https://potentiel.beta.gouv.fr/projet/b6f43d4b-5fcb-4b43-9659-51fb27c5fd7c/details.html",0.3675,0.365,"0"
-- => demande introuvable, à créer à la main => OK
--
-- "https://potentiel.beta.gouv.fr/projet/4156905c-61ce-40d2-a4f0-9e826b083deb/details.html",3.943,3.343,"1689166172640"
-- => abandon. Devrait être 3.943. à creuser
-- "https://potentiel.beta.gouv.fr/projet/b06e9de0-8587-11ea-81a5-9d1e21fb9b29/details.html",7.84845,7848.45,"0"
-- => demande erronée ? modification par admin à vérifier
-- "https://potentiel.beta.gouv.fr/projet/b0696dc0-8587-11ea-81a5-9d1e21fb9b29/details.html",4.988,4988,"0"
-- => demande erronée ? modification par admin à vérifier
-- "https://potentiel.beta.gouv.fr/projet/8c0a5516-2828-48e2-97ae-a162c7cf984f/details.html",0.12825,128.25,"0"
-- => demande erronée ? modification par admin à vérifier
-- "https://potentiel.beta.gouv.fr/projet/870e2292-00f0-4629-8ba7-7c638620cec0/details.html",9.125,9125,"0"
-- => demande annulée, modification par admin à vérifier
-- "https://potentiel.beta.gouv.fr/projet/dde11849-0d79-4a37-8774-35f341767990/details.html",1.13,1130,"0"
-- => demande annulée, modification par admin à vérifier
-- 
--
-- "https://potentiel.beta.gouv.fr/projet/d8bfc6e4-555d-49b7-b89a-1a2ac6008587/details.html",4.562,4.6035,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/7cdec126-664d-46da-9e75-752bc1bd65fe/details.html",1.589,1.51536,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/a9695284-2401-4040-8def-4204b5f05710/details.html",4.4,4.79196,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/f971df74-d150-4d6e-8357-904f965daefd/details.html",3.23,3.54,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/0a664e3c-8734-4cb9-a125-f0b65828bb75/details.html",9.296,10.0944,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/de4be1e8-34f0-4698-9868-5d7bd648cfd7/details.html",2.42,2.42034,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/4c423a5b-02b8-482e-9164-4d887934fc87/details.html",3.667,3.6288,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/c0193b9a-0bc2-447d-a909-51a5e14d5850/details.html",3.131,3.25728,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/03db7b6b-84d8-43f3-9d3e-372d084d60eb/details.html",11.344,11.38891,"0"
-- => erreur liée à candidature, OK
-- "https://potentiel.beta.gouv.fr/projet/d2276636-feb5-4685-9d82-d590c7e0a3f2/details.html",2.457,2.5839,"0"
-- => erreur liée à candidature, OK
--

select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    COALESCE(
        es.payload->'correctedData'->>'puissance',
        es.payload->>'puissance'
    ) as "puissance",
    es.payload->>'justification' as "justification",
    es.payload->>'authority' as "authority",
    es.type,
    es."occurredAt" as "requestedOn",
    requester.email as "requestedBy",
    cancel."occurredAt" as "cancelledOn",
    canceller.email as "cancelledBy",
    accept."occurredAt" as "acceptedOn",
    accepter.email as "acceptedBy",
    reject."occurredAt" as "rejectedOn",
    rejecter.email as "rejectedBy",
    es."occurredAt" as "correctedOn",
    correcter.email as "correctedBy",
    mr.status "expectedStatus",
    p."abandonedOn"
from "eventStores" es
    inner join projects p on p.id::text = es.payload->>'projectId'
    left join users requester on requester.id::text = es.payload->>'requestedBy'
    left join "eventStores" cancel on cancel.type = 'ModificationRequestCancelled'
    and cancel.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users canceller on canceller.id::text = cancel.payload->>'cancelledBy'
    left join "eventStores" accept on accept.type = 'ModificationRequestAccepted'
    and accept.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users accepter on accepter.id::text = accept.payload->>'acceptedBy'
    left join "eventStores" reject on reject.type = 'ModificationRequestRejected'
    and reject.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users rejecter on rejecter.id::text = reject.payload->>'rejectedBy'
    left join "modificationRequests" mr on es.payload->>'modificationRequestId' is not null
    and mr.id::text = es.payload->>'modificationRequestId'
    left join users correcter on es.type = 'ProjectDataCorrected'
    and correcter.id::text = es.payload->>'correctedBy'
where (
        (
            es.type in ('ModificationRequested', 'ModificationReceived')
            and es.payload->>'type' = 'puissance'
            AND es.payload->>'modificationRequestId' not in (
                'bc215b18-6c95-42be-b0eb-a2d7dde95162'
            )
        )
        OR (
            es.type = 'ProjectDataCorrected'
            and es.payload->'correctedData'->>'puissance' is not null
        )
    )
    and p.id = 'b0696dc0-8587-11ea-81a5-9d1e21fb9b29'
order by es."occurredAt";


select *
from event_store.event_stream
where stream_id = 'puissance|CRE4 - Sol#7#2#42';


select *
from "eventStores" es
where 'b0696dc0-8587-11ea-81a5-9d1e21fb9b29' = ANY(es."aggregateId")
order by "occurredAt"