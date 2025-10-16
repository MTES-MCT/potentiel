import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type Props<T extends keyof AppelOffre.RèglesDemandesChangement> = {
  rôle: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement[T];
  conditionsÀRemplirSpécifiquesAuDomain?: boolean;
  domain: Role.PolicyDomains;
};

export const checkAutorisationChangement = async <
  T extends keyof AppelOffre.RèglesDemandesChangement,
>({
  rôle,
  identifiantProjet,
  règlesChangementPourAppelOffres,
  conditionsÀRemplirSpécifiquesAuDomain,
  domain,
}: Props<T>) => {
  const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
    identifiantProjet,
    rôle.nom,
  );

  return {
    peutModifier:
      rôle.aLaPermission(`${domain}.modifier` as Role.Policy) &&
      !règlesChangementPourAppelOffres.demande &&
      !règlesChangementPourAppelOffres.informationEnregistrée,
    peutFaireUneDemandeDeChangement:
      conditionsÀRemplirSpécifiquesAuDomain !== false &&
      rôle.aLaPermission(`${domain}.demanderChangement` as Role.Policy) &&
      !aUnAbandonEnCours &&
      !estAbandonné &&
      !estAchevé &&
      règlesChangementPourAppelOffres.demande,
    peutEnregistrerChangement:
      !conditionsÀRemplirSpécifiquesAuDomain !== false &&
      rôle.aLaPermission(`${domain}.enregistrerChangement` as Role.Policy) &&
      !aUnAbandonEnCours &&
      !estAbandonné &&
      !estAchevé &&
      règlesChangementPourAppelOffres.informationEnregistrée,
  };
};
