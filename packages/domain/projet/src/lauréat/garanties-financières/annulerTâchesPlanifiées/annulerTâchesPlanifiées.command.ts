import { Message } from 'mediateur';

import { IdentifiantProjet } from '../../..';

/**
 * @deprecated Cette commande est temporaire pour permettre l'appel au behavior,
 * qui à terme sera fait directement depuis le behavior appelant, via l'aggregate root.
 **/
export type AnnulerTâchesPlanifiéesGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AnnulerTâchesPlanifiées',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;
