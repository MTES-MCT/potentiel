
create schema system_views;

create view system_views.stream_info as
    select
        split_part(event_stream.stream_id, '|', 1) category,
        split_part(event_stream.stream_id, '|', 2) id,
        min(event_stream.created_at) created_at,
        max(event_stream.created_at) updated_at,
        count(event_stream.stream_id) event_count
    from event_store.event_stream
    group by
        category,
        id
    order by updated_at desc;

create view system_views.stream_category as
    select category, count(id) from system_views.stream_info group by category order by category;