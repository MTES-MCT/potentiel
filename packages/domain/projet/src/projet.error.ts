import { InvalidOperationError } from '@potentiel-domain/core';

export class AppelOffreInexistantError extends InvalidOperationError {
  constructor(appelOffre: string) {
    super(`L'appel d'offres spécifié n'existe pas`, { appelOffre });
  }
}

export class PériodeInexistanteError extends InvalidOperationError {
  constructor(appelOffre: string, période: string) {
    super(`La période spécifiée de l'appel d'offres n'existe pas`, { appelOffre, période });
  }
}

export class FamilleInexistanteError extends InvalidOperationError {
  constructor(appelOffre: string, période: string, famille: string) {
    super(`La famille spécifiée de la période de l'appel d'offres n'existe pas`, {
      appelOffre,
      période,
      famille,
    });
  }
}

export class CahierDesChargesInexistantError extends InvalidOperationError {
  constructor(appelOffre: string, période: string, cahierDesCharges: string) {
    super(`Le cahier des charges spécifié n'existe pas`, {
      appelOffre,
      période,
      cahierDesCharges,
    });
  }
}

export class AggrégatDéjàChargéError extends InvalidOperationError {
  constructor(public aggrégat: string) {
    super(`L'agrégat a déjà été chargé`);
  }
}

export class AggrégatNonChargéError extends InvalidOperationError {
  constructor(public aggrégat: string) {
    super(`L'agrégat n'a pas été chargé`);
  }
}
