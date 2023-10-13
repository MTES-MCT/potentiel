create table if not exists event_store.event_stream (
  stream_id varchar not null,
  created_at varchar not null,
  type varchar not null,
  version integer not null,
  payload jsonb not null,
  primary key (stream_id, created_at, version)
);

create index if not exists event_stream_stream_id_idx on event_store.event_stream (stream_id);

create or replace function event_store.throw_when_trying_to_update_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be updated';
  end;
$$ language plpgsql;

create or replace function event_store.throw_when_trying_to_delete_event() returns void as
$$
  begin
    raise exception 'Event are immutable and can not be deleted';
  end;
$$ language plpgsql;

create or replace rule prevent_delete_on_event_stream as on delete to event_store.event_stream do instead select event_store.throw_when_trying_to_delete_event();
create or replace rule prevent_update_on_event_stream as on update to event_store.event_stream do instead select event_store.throw_when_trying_to_update_event();
