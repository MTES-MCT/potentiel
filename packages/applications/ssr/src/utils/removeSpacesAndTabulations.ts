export const removeSpacesAndTabulations = (content: string): string =>
  content.trim().replace(/\s/g, '');
