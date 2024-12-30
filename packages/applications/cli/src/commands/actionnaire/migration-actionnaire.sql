-- delete subscribers
delete from event_store.subscriber
where stream_category = 'actionnaire';


-- check modifications
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    mr.status,
    mr.actionnaire,
    mr.justification,
    mr."requestedOn",
    u.email,
    mr."cancelledOn",
    u_cancel.email as "cancelledBy",
    u_respond.email as "respondedBy",
    mr.*
from "modificationRequests" mr
    inner join projects p on p.id = mr."projectId"
    left join users u on u.id = mr."userId"
    left join users u_cancel on u_cancel.id = mr."cancelledBy"
    left join users u_respond on u_respond.id = mr."respondedBy"
where mr.type = 'actionnaire';



select *
from event_store.event_stream
where stream_id like 'actionnaire|%';


-- Rebuild actionnaire (RESTART required!!)
call event_store.rebuild('actionnaire');

select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    actionnaire,
    act.value projection
from projects p
    left join domain_views.projection act on act.key = format(
        'actionnaire|%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    )
where p.classe <> 'Eliminé'
    and act.value is null
    and p.actionnaire is not null
    and p.actionnaire <> ''
    and "notifiedOn" > 0;