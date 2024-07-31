import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { GarantiesFinancièresActuelles } from '../../../../../components/organisms/garantiesFinancières/types';

type Props = {
  hasGarantiesFinancièresActuelles: boolean;
  garantiesFinancièresStatut?: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel['garantiesFinancières']['statut'];
  hasAttestation: boolean;
  isProjetAbandonné: boolean;
  isProjetAchevé: boolean;
  estPorteur: boolean;
  estAdminOuDGEC: boolean;
  estDreal: boolean;
  hasNotDépôtOrMainlevée: boolean;
};

export const setGarantiesFinancièresActuellesActions = ({
  hasGarantiesFinancièresActuelles,
  garantiesFinancièresStatut,
  isProjetAbandonné,
  isProjetAchevé,
  estPorteur,
  estAdminOuDGEC,
  estDreal,
  hasNotDépôtOrMainlevée,
  hasAttestation,
}: Props): GarantiesFinancièresActuelles['actions'] => {
  const garantiesFinancièresActuellesActions: GarantiesFinancièresActuelles['actions'] = [];

  const aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée =
    hasAttestation && hasNotDépôtOrMainlevée;

  if (hasGarantiesFinancièresActuelles && garantiesFinancièresStatut) {
    if (!hasAttestation) {
      garantiesFinancièresActuellesActions.push('enregister-attestation');
    }
    if ((estAdminOuDGEC || estDreal) && !garantiesFinancièresStatut.estLevé()) {
      garantiesFinancièresActuellesActions.push('modifier');
    }
    if (estDreal && garantiesFinancièresStatut.estÉchu()) {
      garantiesFinancièresActuellesActions.push('contacter-porteur-pour-gf-échues');
    }
    if (estPorteur) {
      if (aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée && isProjetAbandonné) {
        garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-abandonné');
      }
      if (aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée && isProjetAchevé) {
        garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-achevé');
      }
    }
  }

  return garantiesFinancièresActuellesActions;
};
