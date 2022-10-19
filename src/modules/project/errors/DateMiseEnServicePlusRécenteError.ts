export class DateMiseEnServicePlusRécenteError extends Error {
  constructor() {
    super(`La date de mise en service ne peut être plus récente que celle existante`)
  }
}
