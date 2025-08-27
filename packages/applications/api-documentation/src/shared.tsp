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
