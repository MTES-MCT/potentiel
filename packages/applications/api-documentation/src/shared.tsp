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

model MinutesSecondesDMS {
  @minValue(0) 
  @maxValue(59) 
  minutes: uint8;
  
  @minValue(0) 
  @maxValue(59) 
  secondes: uint8;
}

model CoordonneesLatDMS {
  @minValue(0) 
  @maxValue(90) 
  degrés: uint8;
  
  ...MinutesSecondesDMS;
  cardinal: "N" | "S";
}

model CoordonneesLongDMS {
  @minValue(0)
  @maxValue(180) 
  degrés: uint8;
  
  ...MinutesSecondesDMS;
  cardinal: "E" | "O";
}