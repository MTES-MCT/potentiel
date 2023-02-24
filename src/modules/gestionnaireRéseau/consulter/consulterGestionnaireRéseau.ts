export const PermissionConsulterGestionnaireRéseau = {
  nom: 'consulter-gestionnaire-réseau',
  description: 'Consulter un gestionnaire de réseau',
};

export type ConsulterGestionnaireRéseauReadModel = {
  id: string;
  nom: string;
  format?: string;
  légende?: string;
};

type ConsulterGestionnaireRéseauQuery = {
  id: string;
};

export type ConsulterGestionnaireRéseauQueryHandler = (
  query: ConsulterGestionnaireRéseauQuery,
) => Promise<ConsulterGestionnaireRéseauReadModel | null>;
