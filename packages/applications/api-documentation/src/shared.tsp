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
