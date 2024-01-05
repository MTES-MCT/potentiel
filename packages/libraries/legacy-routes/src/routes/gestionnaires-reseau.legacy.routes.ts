/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_LISTE_GESTIONNAIRES_RESEAU = `/admin/gestionnaires-reseau`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
  codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau/ajouter`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const POST_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const POST_MODIFIER_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
  codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET = (identifiantProjet?: string) => {
  return `/projet/${
    identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
  }/raccordements/modifier-gestionnaire-reseau.html`;
};

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET = (identifiantProjet?: string) => {
  return `/projet/${
    identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
  }/raccordements/modifier-gestionnaire-reseau`;
};
