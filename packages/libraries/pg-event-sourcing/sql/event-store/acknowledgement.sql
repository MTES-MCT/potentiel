create table if not exists event_store.pending_acknowledgement (
  stream_category varchar not null,
  subscriber_name varchar not null,
  stream_id varchar not null,
  created_at varchar not null,
  version integer not null,
  primary key (stream_category, subscriber_name, stream_id, created_at, version)
);