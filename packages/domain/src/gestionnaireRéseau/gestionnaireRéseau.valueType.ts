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

// export const estUnIdentifiantGestionnaireRéseau = (value: any): value is IdentifiantGestionnaireRéseau => {
//   return value.codeEIC && typeof value.codeEIC === 'string';
// }
