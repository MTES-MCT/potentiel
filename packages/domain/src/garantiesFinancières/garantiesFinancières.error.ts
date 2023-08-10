import { InvalidOperationError } from '@potentiel/core-domain';

export class TypeGarantiesFinancièresNonAcceptéErreur extends InvalidOperationError {
  constructor() {
    super(`Le type de garanties financières saisi n'est pas accepté`);
  }
}

export class DateConstitutionGarantiesFinancièreDansLeFuturErreur extends InvalidOperationError {
  constructor() {
    super('La date de constitution des garanties financières ne peut pas être une date future');
  }
}

export class DateÉchéanceGarantiesFinancièresNonAcceptéeErreur extends InvalidOperationError {
  constructor() {
    super(
      "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné",
    );
  }
}

export class DateÉchéanceGarantiesFinancièresRequiseErreur extends InvalidOperationError {
  constructor() {
    super("La date d'échéance est requise pour ce type de garanties financières");
  }
}

export class ModificationGarantiesFinancièresNonAutoriséeErreur extends InvalidOperationError {
  constructor() {
    super('Vous ne pouvez pas modifier des données de garanties financières déjà validées');
  }
}

export class DépôtGarantiesFinancièresNonTrouvéPourModificationErreur extends InvalidOperationError {
  constructor() {
    super('Le dépôt de garanties financières que vous tentez de modifier est introuvable');
  }
}
