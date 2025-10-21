import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  rôle: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement[TDomain];
  nécessiteInstruction?: boolean;
  domain: TDomain;
};

export const checkAutorisationChangement = async <
  TDomain extends keyof AppelOffre.RèglesDemandesChangement,
>({
  rôle,
  identifiantProjet,
  règlesChangementPourAppelOffres,
  nécessiteInstruction,
  domain,
}: Props<TDomain>) => {
  const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
    identifiantProjet,
    rôle.nom,
  );

  const peutModifier =
    rôle.aLaPermission(`${domain}.modifier` as Role.Policy);

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
