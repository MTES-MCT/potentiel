export const transformCommuneToOreFormat = (commune: string) => {
  return commune
    .toLowerCase()
    .replace(/(?:^|[^a-zA-Z])([a-z])/g, (match, p1, offset) => {
      if (offset === 0) {
        return p1.toUpperCase();
      }
      return match.slice(0, -1) + match.charAt(match.length - 1).toUpperCase();
    })
    .replace(/\d/g, '')
    .replace('St ', 'Saint ')
    .replace('Ste ', 'Sainte ')
    .replace(' St ', ' Saint ')
    .replace(' Ste ', ' Sainte ')
    .replace('D ', "D'")
    .replace('L ', "L'")
    .trim();
};
