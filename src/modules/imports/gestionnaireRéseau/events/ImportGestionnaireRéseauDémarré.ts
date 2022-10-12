import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type ImportGestionnaireRéseauDémarréPayload = {
  démarréPar: string
  gestionnaire: string
}

export class ImportGestionnaireRéseauDémarré
  extends BaseDomainEvent<ImportGestionnaireRéseauDémarréPayload>
  implements DomainEvent
{
  public static type: 'ImportGestionnaireRéseauDémarré' = 'ImportGestionnaireRéseauDémarré'
  public type = ImportGestionnaireRéseauDémarré.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ImportGestionnaireRéseauDémarréPayload) {
    return `import-gestionnaire-réseau#${payload.gestionnaire}`
  }
}
