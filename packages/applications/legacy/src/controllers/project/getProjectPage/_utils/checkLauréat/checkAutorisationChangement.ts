import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  rôle: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement[TDomain];
  règlesSpécifiquesParDomain?: {
    demandeActionnaireNécessiteInstruction?: boolean;
    changementProducteurPossibleAvantAchèvement?: boolean;
  };
  domain: TDomain;
};

export const checkAutorisationChangement = async <
  TDomain extends keyof AppelOffre.RèglesDemandesChangement,
>({
  rôle,
  identifiantProjet,
  règlesChangementPourAppelOffres,
  règlesSpécifiquesParDomain,
  domain,
}: Props<TDomain>) => {
  const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
    identifiantProjet,
    rôle.nom,
  );

  if(domain === "producteur" && règlesChangementPourAppelOffres.)
  const règleSpéciale


  const peutModifier =
    rôle.aLaPermission(`${domain}.modifier` as Role.Policy) &&
    (règlesChangementPourAppelOffres.demande ||
      règlesChangementPourAppelOffres.informationEnregistrée);

  const peutFaireUneDemandeDeChangement =
    ((domain === 'actionnaire' &&
    règlesSpécifiquesParDomain?.demandeActionnaireNécessiteInstruction) &&
    rôle.aLaPermission(`${domain}.demanderChangement` as Role.Policy) &&
    !aUnAbandonEnCours &&
    !estAbandonné &&
    !estAchevé &&
    règlesChangementPourAppelOffres.demande;

  const peutEnregistrerChangement =
    !changementEstInterdit &&
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
