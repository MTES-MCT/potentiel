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

export type ConsulterGestionnaireRéseau = (
  id: string,
) => Promise<ConsulterGestionnaireRéseauReadModel | null>;
