-- Grant spécifique au contexte des tests, pour pouvoir clean la DB aprés chaque éxecution de test
-- NE DOIT PAS ÊTRE MIS EN PLACE DANS UN ENV DE PRODUCTION
ALTER TABLE event_store.event_stream OWNER TO potentiel;
GRANT SELECT, INSERT, DELETE ON event_store.event_stream TO potentiel;