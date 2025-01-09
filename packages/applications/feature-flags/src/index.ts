export const isDemandeChangementReprésentantLégalEnabled = () =>
  process.env.NEXT_PUBLIC_IS_DEMANDE_CHANGEMENT_REPRESENTANT_LEGAL_ENABLED === 'true';

export const isActionnaireEnabled = () => process.env.NEXT_PUBLIC_IS_ACTIONNAIRE_ENABLED === 'true';
