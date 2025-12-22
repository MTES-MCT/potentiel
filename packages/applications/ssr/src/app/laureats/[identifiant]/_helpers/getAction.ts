import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';

import { peutEffectuerUnChangement } from './peutEffectuerUnChangement';
import { mapChangements } from './mapChangements';

export type DomaineAction = keyof AppelOffre.RèglesDemandesChangement;

type Props<TDomain extends DomaineAction> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  domain: TDomain;
  /** Forcer l'instruction, utile quand le domaine a une règle complexe (actionnaire)  */
  nécessiteInstruction?: boolean;
};

export const getAction = async <TDomain extends DomaineAction>({
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
  const champsSupplémentairesAO = cahierDesCharges.getChampsSupplémentaires();
  if (champSupplémentaire && !champsSupplémentairesAO[champSupplémentaire]) {
    return;
  }

  if (!!modifier && rôle.aLaPermission(modifier.permission) && règlesChangement.modificationAdmin) {
    return {
      url: modifier.url(identifiantProjet.formatter()),
      label: modifier.label,
      labelActions: modifier.labelActions,
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
      labelActions: enregistrerChangement.labelActions,
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
      labelActions: demanderChangement.labelActions,
    };
  }
};
