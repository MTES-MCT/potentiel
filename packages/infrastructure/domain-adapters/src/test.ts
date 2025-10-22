import { IdentifiantProjet } from '@potentiel-domain/projet';

import { récupererConstututionGarantiesFinancièresAdapter } from './projet';

void récupererConstututionGarantiesFinancièresAdapter(
  IdentifiantProjet.convertirEnValueType('PPE2 - Petit PV Bâtiment#1##27020594'),
).then(console.log);
