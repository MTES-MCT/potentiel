import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '../../../_helpers';

import { checkLauréatSansAbandonOuAchèvement } from './checkLauréatSansAbandonOuAchèvement';

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  domain: TDomain;
  nécessiteInstruction?: boolean;
};

export const checkAutorisationChangement = async <
  TDomain extends keyof AppelOffre.RèglesDemandesChangement,
>({
  identifiantProjet,
  rôle,
  domain,
  nécessiteInstruction,
}: Props<TDomain>) => {
  const estUnLauréatSansAbandonOuAchèvement =
    await checkLauréatSansAbandonOuAchèvement(identifiantProjet);
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  const peutModifier = rôle.aLaPermission(`${domain}.modifier` as Role.Policy);

  const peutFaireUneDemandeDeChangement =
    nécessiteInstruction !== false &&
    rôle.aLaPermission(`${domain}.demanderChangement` as Role.Policy) &&
    estUnLauréatSansAbandonOuAchèvement &&
    cahierDesCharges.getRèglesChangements(domain).demande;

  const peutEnregistrerChangement =
    nécessiteInstruction !== true &&
    rôle.aLaPermission(`${domain}.enregistrerChangement` as Role.Policy) &&
    estUnLauréatSansAbandonOuAchèvement &&
    cahierDesCharges.getRèglesChangements(domain).informationEnregistrée;

  return {
    peutModifier,
    peutFaireUneDemandeDeChangement,
    peutEnregistrerChangement,
  };
};
