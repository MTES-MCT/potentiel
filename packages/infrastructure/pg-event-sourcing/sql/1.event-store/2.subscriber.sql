create table if not exists event_store.subscriber (
  stream_category varchar not null,
  subscriber_name varchar not null,
  filter jsonb default null,
  primary key (stream_category, subscriber_name)
);