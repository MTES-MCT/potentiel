create schema system_views;

create view system_views.stream_info as
    select
        split_part(es.stream_id, '|', 1) category,
        split_part(es.stream_id, '|', 2) id,
        min(es.created_at) created_at,
        max(es.created_at) updated_at,
        count(es.stream_id) event_count,
        count(pa.*) pending_acknowledgement_count,
        case
            when coalesce(max(pa.version), max(es.version)) < max(es.version) then 'inconsistent_after_next_retry' else 'ok' end as status
    from event_store.event_stream as es
    left outer join event_store.pending_acknowledgement as pa on pa.stream_id = es.stream_id and pa.created_at = es.created_at and pa.version = es.version
    group by
        category,
        id
    order by updated_at desc;

create view system_views.stream_category as
    select category, count(id) from system_views.stream_info group by category order by category;