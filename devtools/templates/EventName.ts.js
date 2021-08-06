const { pascalCase } = require('change-case')

module.exports = function(args){

  const { eventName } = args

  return `
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ${pascalCase(eventName)}Payload {
  itemId: string
}

export class ${pascalCase(eventName)} extends BaseDomainEvent<${pascalCase(eventName)}Payload> implements DomainEvent {
  public static type: '${pascalCase(eventName)}' = '${pascalCase(eventName)}'
  public type = ${pascalCase(eventName)}.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ${pascalCase(eventName)}Payload) {
    return payload.itemId
  }
}`

}