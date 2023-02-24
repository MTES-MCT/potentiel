export const PermissionConsulterGestionnaireRéseau = {
  nom: 'consulter-gestionnaire-réseau',
  description: 'Consulter un gestionnaire de réseau',
};

export type ConsulterGestionnaireRéseauReadModel = {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
};

type ConsulterGestionnaireRéseauQuery = {
  codeEIC: string;
};

export type ConsulterGestionnaireRéseauQueryHandler = (
  query: ConsulterGestionnaireRéseauQuery,
) => Promise<ConsulterGestionnaireRéseauReadModel | null>;
