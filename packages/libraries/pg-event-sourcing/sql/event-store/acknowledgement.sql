create table if not exists event_store.pending_acknowledgement (
  subscriber_id varchar not null,
  stream_id varchar not null,
  created_at varchar not null,
  version integer not null,
  primary key (subscriber_id, stream_id, created_at, version)
);