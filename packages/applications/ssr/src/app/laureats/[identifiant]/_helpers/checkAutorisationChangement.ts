import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { checkLauréatSansAbandonOuAchèvement } from './checkLauréatSansAbandonOuAchèvement';

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement[TDomain];
  nécessiteInstruction?: boolean;
  domain: TDomain;
};

export const checkAutorisationChangement = async <
  TDomain extends keyof AppelOffre.RèglesDemandesChangement,
>({
  identifiantProjet,
  rôle,
  règlesChangementPourAppelOffres,
  nécessiteInstruction,
  domain,
}: Props<TDomain>) => {
  const estUnLauréatSansAbandonOuAchèvement =
    await checkLauréatSansAbandonOuAchèvement(identifiantProjet);

  const peutModifier = rôle.aLaPermission(`${domain}.modifier` as Role.Policy);

  const peutFaireUneDemandeDeChangement =
    nécessiteInstruction !== false &&
    rôle.aLaPermission(`${domain}.demanderChangement` as Role.Policy) &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementPourAppelOffres.demande;

  const peutEnregistrerChangement =
    nécessiteInstruction !== true &&
    rôle.aLaPermission(`${domain}.enregistrerChangement` as Role.Policy) &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementPourAppelOffres.informationEnregistrée;

  return {
    peutModifier,
    peutFaireUneDemandeDeChangement,
    peutEnregistrerChangement,
  };
};
