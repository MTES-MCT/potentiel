create or replace procedure event_store.rebuild(
  p_category varchar,
  p_id varchar default null
)
as
$$
declare
  v_row event_store.event_stream%ROWTYPE;
  v_chanel varchar;
  v_streamId varchar;
begin
  for v_chanel in
    select stream_category || '|' || subscriber_name
    from event_store.subscriber
    where stream_category = p_category and (filter is null or 'RebuildTriggered' in (select jsonb_array_elements_text(filter)))
  loop
    if p_id is not null then
      select into v_row
        stream_id
      from event_store.event_stream
      where stream_id = p_category || '|' || p_id;

      if found then
        perform pg_notify(v_chanel, json_build_object(
          'version', 1,
          'created_at', now()::text,
          'stream_id', v_row.stream_id,
          'type', 'RebuildTriggered',
          'payload', json_build_object(
            'category', p_category,
            'id', p_id
          )
        )::text);
      end if;
    else
      for v_streamId in
        select distinct stream_id
        from event_store.event_stream
        where stream_id like p_category || '|%'
      loop
        insert into event_store.pending_acknowledgement
        values (p_category, SPLIT_PART(v_chanel,'|',2), v_streamId, now()::text, 1);

        perform pg_notify(v_chanel, json_build_object(
          'version', 1,
          'created_at', now()::text,
          'stream_id', v_streamId,
          'type', 'RebuildTriggered',
          'payload', json_build_object(
            'category', p_category,
            'id', split_part(v_streamId, '|', 2)
          )
        )::text);
      end loop;
    end if;
  end loop;
  exception
  when others then
    perform pg_notify('error_notifications', json_build_object('error_message', sqlerrm)::text);
end;
$$ language plpgsql;
