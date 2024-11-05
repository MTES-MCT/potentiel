import { Option } from '@potentiel-libraries/monads';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { StatutProjet } from '@potentiel-domain/common';

import { GarantiesFinancièresActuelles } from '@/components/organisms/garantiesFinancières/types';

type GetGarantiesFinancièresActuellesActions = {
  role: Role.ValueType;
  garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel['garantiesFinancières'];
  dépôt: Option.Type<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel>;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel>;
  achèvement: Option.Type<Achèvement.ConsulterAttestationConformitéReadModel>;
  statutProjet: StatutProjet.RawType;
};
export const getGarantiesFinancièresActuellesActions = ({
  role,
  garantiesFinancières,
  dépôt,
  mainlevée,
  achèvement,
  statutProjet,
}: GetGarantiesFinancièresActuellesActions) => {
  const estAdminOuDGEC = role.estÉgaleÀ(Role.admin) || role.estÉgaleÀ(Role.dgecValidateur);
  const estDreal = role.estÉgaleÀ(Role.dreal);
  const estPorteur = role.estÉgaleÀ(Role.porteur);

  const garantiesFinancièresAvecAttestation = garantiesFinancières.attestation;
  const garantiesFinancièresLevées = garantiesFinancières.statut.estLevé();
  const garantiesFinancièresÉchues = garantiesFinancières.statut.estÉchu();
  const dépôtEnCours = Option.isSome(dépôt) ? dépôt : undefined;
  const mainlevéeExistante = Option.isSome(mainlevée) ? mainlevée : undefined;

  const projetAbandonné = statutProjet === 'abandonné';
  const projetAchevé = Option.isSome(achèvement) ? achèvement : undefined;

  const aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée =
    garantiesFinancièresAvecAttestation && !dépôtEnCours && !mainlevéeExistante;

  const actions: GarantiesFinancièresActuelles['actions'] = [];

  if (!garantiesFinancièresAvecAttestation && (estAdminOuDGEC || estDreal || estPorteur)) {
    actions.push('enregister-attestation');
  }

  if ((estAdminOuDGEC || estDreal) && !garantiesFinancièresLevées) {
    actions.push('modifier');
  }

  if (
    estPorteur &&
    aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée &&
    !garantiesFinancièresÉchues
  ) {
    if (projetAbandonné) {
      actions.push('demander-mainlevée-gf-pour-projet-abandonné');
    }
    if (projetAchevé) {
      actions.push('demander-mainlevée-gf-pour-projet-achevé');
    }
  }

  if (estDreal && garantiesFinancièresÉchues) {
    actions.push('contacter-porteur-pour-gf-échues');
  }

  return actions;
};
