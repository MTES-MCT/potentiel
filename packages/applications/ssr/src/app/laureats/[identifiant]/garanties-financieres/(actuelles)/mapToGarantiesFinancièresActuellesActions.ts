import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresActuelles } from './garantiesFinancièresActuelles.type';

type MapToGarantiesFinancièresActuellesActionsProps = {
  role: Role.ValueType;
  garantiesFinancières: Lauréat.GarantiesFinancières.DétailsGarantiesFinancièresReadModel;
  dépôt: Option.Type<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
  mainlevée?: Lauréat.GarantiesFinancières.ListerMainlevéesReadModel['items'][number];
  achèvement: Option.Type<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéReadModel>;
  estAbandonné: boolean;
};
export const mapToGarantiesFinancièresActuellesActions = ({
  role,
  garantiesFinancières,
  dépôt,
  mainlevée,
  achèvement,
  estAbandonné,
}: MapToGarantiesFinancièresActuellesActionsProps) => {
  const estAdminOuDGEC = role.estÉgaleÀ(Role.admin) || role.estÉgaleÀ(Role.dgecValidateur);
  const estDreal = role.estÉgaleÀ(Role.dreal);
  const estPorteur = role.estÉgaleÀ(Role.porteur);

  const garantiesFinancièresAvecAttestation = garantiesFinancières.attestation;
  const garantiesFinancièresLevées = garantiesFinancières.statut.estLevé();
  const garantiesFinancièresÉchues = garantiesFinancières.statut.estÉchu();
  const dépôtEnCours = Option.isSome(dépôt) ? dépôt : undefined;

  const projetAchevé = Option.isSome(achèvement) ? achèvement : undefined;

  const aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée =
    garantiesFinancièresAvecAttestation && !dépôtEnCours && !mainlevée;

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
    if (estAbandonné) {
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
