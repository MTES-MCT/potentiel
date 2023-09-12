drop table if exists event_store.subscriber;
create table event_store.subscriber (
  subscriber_id varchar not null primary key,
  filter jsonb default null
);