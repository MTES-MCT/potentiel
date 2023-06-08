export type RawIdentifiantGestionnaireRéseau = string;

export type IdentifiantGestionnaireRéseau = {
  codeEIC: string;
  formatter: () => RawIdentifiantGestionnaireRéseau;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string | Omit<IdentifiantGestionnaireRéseau, 'formatter'>,
): IdentifiantGestionnaireRéseau => {
  return {
    codeEIC:
      typeof identifiantGestionnaireRéseau === 'string'
        ? identifiantGestionnaireRéseau
        : identifiantGestionnaireRéseau.codeEIC,
    formatter() {
      return this.codeEIC;
    },
  };
};
