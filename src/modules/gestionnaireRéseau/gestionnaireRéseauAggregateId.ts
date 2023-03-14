export type GestionnaireRéseauAggregateId = `gestionnaire-réseau#${string}`;

export const createGestionnaireRéseauAggregateId = (
  codeEIC: string,
): GestionnaireRéseauAggregateId => `gestionnaire-réseau#${codeEIC}`;
