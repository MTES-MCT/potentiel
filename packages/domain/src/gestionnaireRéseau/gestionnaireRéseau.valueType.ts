export type RawIdentifiantGestionnaireRéseau = string;

export type IdentifiantGestionnaireRéseau = {
  codeEIC: string;
};

export type IdentifiantGestionnaireRéseauValueType = IdentifiantGestionnaireRéseau & {
  formatter: () => RawIdentifiantGestionnaireRéseau;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string | IdentifiantGestionnaireRéseau,
): IdentifiantGestionnaireRéseauValueType => {
  const codeEIC = estUnIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau)
    ? identifiantGestionnaireRéseau.codeEIC
    : identifiantGestionnaireRéseau;

  return {
    codeEIC,
    formatter() {
      return this.codeEIC;
    },
  };
};

export const estUnIdentifiantGestionnaireRéseau = (
  value: any,
): value is IdentifiantGestionnaireRéseau => {
  return typeof value.codeEIC === 'string';
};
