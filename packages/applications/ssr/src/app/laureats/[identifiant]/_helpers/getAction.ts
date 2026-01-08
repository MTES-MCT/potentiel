import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from '@/app/_helpers';

import { peutEffectuerUnChangement } from './peutEffectuerUnChangement';
import { mapChangements } from './mapChangements';

type Props<TDomain extends AppelOffre.DomainesConcernésParChangement> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  domain: TDomain;
  /** Forcer l'instruction, utile quand le domaine a une règle complexe (actionnaire)  */
  nécessiteInstruction?: boolean;
};

export const getAction = async <TDomain extends AppelOffre.DomainesConcernésParChangement>({
  identifiantProjet,
  rôle,
  domain,
  nécessiteInstruction,
}: Props<TDomain>) => {
  const { modifier, demanderChangement, enregistrerChangement, champSupplémentaire } =
    mapChangements[domain];

  if (!modifier && !demanderChangement && !enregistrerChangement) {
    return;
  }

  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
  const règlesChangement = cahierDesCharges.getRèglesChangements(domain);
  const règlesModification = cahierDesCharges.getRèglesModification(domain);
  const champsSupplémentairesAO = cahierDesCharges.getChampsSupplémentaires();
  if (champSupplémentaire && !champsSupplémentairesAO[champSupplémentaire]) {
    return;
  }

  if (!!modifier && rôle.aLaPermission(modifier.permission) && règlesModification) {
    return {
      url: modifier.url(identifiantProjet.formatter()),
      label: modifier.label,
      labelMenu: modifier.labelMenu,
    };
  }

  const changementPossible = await peutEffectuerUnChangement(identifiantProjet);
  if (!changementPossible) {
    return;
  }

  if (
    !!enregistrerChangement &&
    !nécessiteInstruction &&
    rôle.aLaPermission(enregistrerChangement.permission) &&
    règlesChangement.informationEnregistrée
  ) {
    return {
      url: enregistrerChangement.url(identifiantProjet.formatter()),
      label: enregistrerChangement.label,
      labelMenu: enregistrerChangement.labelMenu,
    };
  }

  if (
    !!demanderChangement &&
    rôle.aLaPermission(demanderChangement.permission) &&
    règlesChangement.demande
  ) {
    return {
      url: demanderChangement.url(identifiantProjet.formatter()),
      label: demanderChangement.label,
      labelMenu: demanderChangement.labelMenu,
    };
  }
};
