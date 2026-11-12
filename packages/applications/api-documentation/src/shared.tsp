@error
model Error {
  message: string;
}

model RangeOptions {
  startPosition: uint16;
  endPosition: uint16;
}

model ListResult<T> {
  items: Array<T>;
  range: RangeOptions;
  total: uint16;
}

model Addresse {
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  departement: string;
  region: string;
}

/** Numéro SIREN (9 chiffres) */
@pattern("^[0-9]{9}$")
@example("123456789")
scalar Siren extends string;

/** Numéro SIRET (14 chiffres) */
@pattern("^[0-9]{14}$")
@example("12345678900012")
scalar Siret extends string;



union TypologieInstallation {
  "bâtiment.neuf",
  "bâtiment.existant-avec-rénovation-de-toiture",
  "bâtiment.existant-sans-rénovation-de-toiture",
  "bâtiment.serre",
  "bâtiment.serre-agrivoltaïque-pré-aper",
  "bâtiment.serre-agrivoltaïque-post-aper",
  "bâtiment.stabulation",
  "bâtiment.mixte",
  "bâtiment.non-précisé",
  "ombrière.parking",
  "ombrière.agrivoltaïque",
  "ombrière.agrivoltaïque-pré-aper",
  "ombrière.agrivoltaïque-post-aper",
  "ombrière.autre",
  "ombrière.mixte",
  "sol.non-précisé",
  "sol.flottant",
  "agrivoltaïque.culture",
  "agrivoltaïque.jachère-plus-de-5-ans",
  "agrivoltaïque.élevage",
  "agrivoltaïque.serre",
  "agrivoltaïque.non-précisé",
}