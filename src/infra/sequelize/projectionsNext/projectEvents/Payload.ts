type JSONValue = string | number | boolean | { [key: string]: JSONValue } | Array<JSONValue> | Date;

export type Payload = {
  [key: string]: JSONValue;
};
