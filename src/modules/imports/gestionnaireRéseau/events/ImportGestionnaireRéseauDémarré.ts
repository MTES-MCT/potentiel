import { BaseDomainEvent, DomainEvent } from '@core/domain'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'

type ImportGestionnaireRéseauDémarréPayload = {
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
    return ImportGestionnaireRéseauId.format(payload.gestionnaire).toString()
  }
}
