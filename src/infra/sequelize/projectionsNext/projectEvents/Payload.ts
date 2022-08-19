type JSONValue = string | number | boolean | { [key: string]: JSONValue } | Array<JSONValue>

export type Payload = {
  [key: string]: JSONValue
}
