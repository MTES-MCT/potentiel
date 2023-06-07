export type RawIdentifiantGestionnaireRéseau = string;

export type IdentifiantGestionnaireRéseau = {
  codeEIC: string;
  formatter: () => RawIdentifiantGestionnaireRéseau;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string,
): IdentifiantGestionnaireRéseau => ({
  codeEIC: identifiantGestionnaireRéseau,
  formatter() {
    return this.codeEIC;
  },
});
