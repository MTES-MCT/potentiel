-- Niveau de droit à mettre en place une fois Metabase isolé via un schéma (doit être exe avec un compte admin postgres)

-- Grant Application Potentiel (App Node + CRON)
-- Legacy
GRANT USAGE ON SCHEMA public TO potentiel;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO potentiel;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO potentiel;


-- Sequences (Legacy)
GRANT USAGE, SELECT, UPDATE ON SEQUENCE "public"."statistiquesUtilisation_id_seq" TO potentiel;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE "public"."taches_id_seq" TO potentiel;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE "public"."userDreals_id_seq" TO potentiel;

-- Event Store
GRANT USAGE ON SCHEMA event_store TO potentiel;
GRANT SELECT, INSERT ON event_store.event_stream TO potentiel;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_store.subscriber TO potentiel;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_store.pending_acknowledgement TO potentiel;

-- Auth schema
GRANT USAGE ON SCHEMA auth TO potentiel;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth TO potentiel;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO potentiel;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO potentiel;

-- Domain Views
GRANT USAGE ON SCHEMA domain_views TO potentiel;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA domain_views TO potentiel;
ALTER DEFAULT PRIVILEGES IN SCHEMA domain_views GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO potentiel;

-- Grant Application Potentiel (CRON extraire stats)
-- Stats
GRANT USAGE ON SCHEMA domain_public_statistic TO potentiel;
GRANT SELECT, INSERT, DELETE ON ALL TABLES IN SCHEMA domain_public_statistic TO potentiel;
ALTER DEFAULT PRIVILEGES IN SCHEMA domain_public_statistic GRANT SELECT, INSERT, DELETE ON TABLES TO potentiel;

-- Grant Metabase Potentiel
GRANT USAGE ON SCHEMA domain_public_statistic TO metabase;
GRANT SELECT ON ALL TABLES IN SCHEMA domain_public_statistic TO metabase;
ALTER DEFAULT PRIVILEGES IN SCHEMA domain_public_statistic GRANT SELECT ON TABLES TO metabase;
