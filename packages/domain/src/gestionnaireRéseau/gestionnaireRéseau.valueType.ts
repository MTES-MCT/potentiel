export const formatIdentifiantGestionnaireRéseau = ({ codeEIC }: IdentifiantGestionnaireRéseau) =>
  codeEIC;

export const parseIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string,
): IdentifiantGestionnaireRéseau => ({
  codeEIC: identifiantGestionnaireRéseau,
});

export type IdentifiantGestionnaireRéseau = {
  codeEIC: string;
};
