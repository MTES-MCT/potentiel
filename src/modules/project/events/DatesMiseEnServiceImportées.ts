import { DomainEvent, BaseDomainEvent } from '@core/domain'

export type DatesParNumeroDeGestionnaire = {
  numéroGestionnaire: string
  dateDeMiseEnService: string
}

export type DatesMiseEnServiceImportéesPayload = {
  utilisateurId: string
  datesParNumeroDeGestionnaire: DatesParNumeroDeGestionnaire[]
}

export class DatesMiseEnServiceImportées
  extends BaseDomainEvent<DatesMiseEnServiceImportéesPayload>
  implements DomainEvent
{
  public static type: 'DatesMiseEnServiceImportées' = 'DatesMiseEnServiceImportées'
  public type = DatesMiseEnServiceImportées.type
  currentVersion = 1

  aggregateIdFromPayload() {
    return undefined
  }
}
