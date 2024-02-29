export class ImpossibleDeChangerLaDateDeFAError extends Error {
  constructor() {
    super(
      `La date d'entrée en file d'attente importée ne peut pas être enregistrée car le projet a déjà une date d'entrée en file d'attente associée à une date de mise en service.`,
    );
  }
}
