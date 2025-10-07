create or replace procedure event_store.rebuild(
    p_category varchar,
    p_id varchar default null
  ) as $$
declare jobs_array graphile_worker.job_spec [];
begin
select array(
    select json_populate_record(
        null::graphile_worker.job_spec,
        json_build_object(
          'identifier',
          'rebuild',
          'payload',
          json_build_object(
            'version',
            1,
            'created_at',
            now()::text,
            'stream_id',
            stream_id,
            'type',
            'RebuildTriggered',
            'payload',
            json_build_object(
              'category',
              p_category,
              'id',
              split_part(stream_id, '|', 2)
            )
          ),
          'priority',
          case
            when subscriber_name = 'projector' then 0
            when subscriber_name = 'history' then 10
            else 1
          end
        )
      )
    from event_store.event_stream
      inner join event_store.subscriber on stream_category = p_category
      and subscriber_name = 'projector'
    WHERE (
        p_id is NULL
        AND stream_id like p_category || '|%'
      )
      OR (
        p_id is not null
        AND stream_id = p_category || '|' || p_id
      )
    group by stream_id,
      stream_category,
      subscriber_name
  ) into jobs_array;
perform graphile_worker.add_jobs(jobs_array);

exception
when others then perform graphile_worker.add_job(
  'error_notifications',
  json_build_object('error_message', sqlerrm)
);
end;
$$ language plpgsql;