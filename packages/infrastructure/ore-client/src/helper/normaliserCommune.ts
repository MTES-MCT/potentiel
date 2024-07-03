export const normaliserCommune = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('’', "'")
    .toLowerCase()
    .replaceAll('-', ' ')
    .trim()
    .replace(/^st (.+)/, 'saint $1')
    .replace(/^ste (.+)/, 'sainte $1')
    .replace(/^(.+) st (.+)/, '$1 saint $2')
    .replace(/^(.+) ste (.+)/, '$1 sainte $2')
    .replaceAll(/^d (.+)/g, "d'$1")
    .replaceAll(/^l (.+)/g, "l'$1")
    .replaceAll(/(.+) d (.+)/g, "$1 d'$2")
    .replaceAll(/(.+) l (.+)/g, "$1 l'$2")
    .replace(/cedex( \d+)?/i, '')
    .trim();
};
