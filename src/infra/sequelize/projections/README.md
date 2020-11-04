Projections are data sources for Queries (see CQRS).

Updates on the projections happen either directly during a call to Repository.save(aggregate) or through a event-handler (see Event Sourcing).

Mutations should never be done in the projections themselves. Use a Repository instead (in repos/).
