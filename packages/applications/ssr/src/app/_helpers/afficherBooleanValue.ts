export const afficherBooleanValue = (value: boolean | undefined) =>
  value === undefined ? '' : value ? 'oui' : 'non';
