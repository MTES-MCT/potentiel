// l'identifiant dans le fichier est au format "lisible" et pas au format technique
// on remplace les séparateurs de segments de "-" en "#"
// Ex: CRE4 - Bâtiment-1-2-3 => CRE4 - Bâtiment#1#2#3
export function parseIdentifiantProjet(identifiant: string) {
  return identifiant.replace(/(.*)-P?(\d*)-F?(.{0,3})-(.*)/, '$1#$2#$3#$4');
}
