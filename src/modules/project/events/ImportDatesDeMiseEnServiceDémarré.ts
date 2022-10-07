import { DomainEvent, BaseDomainEvent } from '@core/domain'

export type DatesParNumeroDeGestionnaire = {
  numéroGestionnaire: string
  dateDeMiseEnService: string
}

export type ImportDatesDeMiseEnServiceDémarréPayload = {
  utilisateurId: string
  datesDeMiseEnServiceParNumeroDeGestionnaire: DatesParNumeroDeGestionnaire[]
}

export class ImportDatesDeMiseEnServiceDémarré
  extends BaseDomainEvent<ImportDatesDeMiseEnServiceDémarréPayload>
  implements DomainEvent
{
  public static type: 'ImportDatesDeMiseEnServiceDémarré' = 'ImportDatesDeMiseEnServiceDémarré'
  public type = ImportDatesDeMiseEnServiceDémarré.type
  currentVersion = 1

  aggregateIdFromPayload() {
    return undefined
  }
}
