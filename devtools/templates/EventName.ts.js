module.exports = function(args){

  const { eventName } = args

  return `
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ${eventName}Payload {
  itemId: string
}

export class ${eventName} extends BaseDomainEvent<${eventName}Payload> implements DomainEvent {
  public static type: '${eventName}' = '${eventName}'
  public type = ${eventName}.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ${eventName}Payload) {
    return payload.itemId
  }
}`

}