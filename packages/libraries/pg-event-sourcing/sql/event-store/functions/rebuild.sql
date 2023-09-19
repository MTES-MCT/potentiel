create or replace procedure event_store.rebuild(
  p_category varchar,
  p_id varchar default null
)
as
$$
  begin
    if p_id is not null then
        insert into event_store.event_stream
        values (
            p_category || '|' || p_id,
            left(trim(both '"' from to_json(now())::text), 23) || 'Z',
            'RebuildTriggered',
            (
                select coalesce(version, 0) + 1
                from event_store.event_stream
                where stream_id = p_category || '|' || p_id
                order by version desc
                limit 1
            ),
            json_build_object('category', p_category, 'id', p_id)
        );
    else
      insert into event_store.event_stream
      select p_category || '|' || si.id, left(trim(both '"' from to_json(now())::text), 23) || 'Z', 'RebuildTriggered', coalesce(max(es.version), 0) + 1, json_build_object('category', p_category, 'id', si.id)
      from system_views.stream_info si
      left join event_store.event_stream es on (p_category || '|' || si.id) = es.stream_id
      where si.category = p_category
      group by si.id;
    end if;
  end
$$ language plpgsql;