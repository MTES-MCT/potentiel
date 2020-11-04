Repositories are destined to load aggregates and persist any changes to them.

As a rule of thumb, they should only be invoked for Commands (see CQRS).
For Queries, use a projection instead.
