export const afficherBooleanValue = (value: boolean | undefined) =>
  value === undefined ? 'N/A' : value ? 'oui' : 'non';
