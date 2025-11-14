import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  rôle: Role.ValueType;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement[TDomain];
  nécessiteInstruction?: boolean;
  domain: TDomain;
  aUnAbandonEnCours: boolean;
  estAbandonné: boolean;
  estAchevé: boolean;
};

export const checkAutorisationChangement = async <
  TDomain extends keyof AppelOffre.RèglesDemandesChangement,
>({
  rôle,
  règlesChangementPourAppelOffres,
  nécessiteInstruction,
  domain,
  aUnAbandonEnCours,
  estAbandonné,
  estAchevé,
}: Props<TDomain>) => {
  const peutModifier = rôle.aLaPermission(`${domain}.modifier` as Role.Policy);

  const peutFaireUneDemandeDeChangement =
    nécessiteInstruction !== false &&
    rôle.aLaPermission(`${domain}.demanderChangement` as Role.Policy) &&
    !aUnAbandonEnCours &&
    !estAbandonné &&
    !estAchevé &&
    règlesChangementPourAppelOffres.demande;

  const peutEnregistrerChangement =
    nécessiteInstruction !== true &&
    rôle.aLaPermission(`${domain}.enregistrerChangement` as Role.Policy) &&
    !aUnAbandonEnCours &&
    !estAbandonné &&
    !estAchevé &&
    règlesChangementPourAppelOffres.informationEnregistrée;

  return {
    peutModifier,
    peutFaireUneDemandeDeChangement,
    peutEnregistrerChangement,
  };
};
