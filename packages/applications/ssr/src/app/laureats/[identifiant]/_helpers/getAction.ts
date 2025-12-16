import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '../../../_helpers';

import { peutEffectuerUnChangement } from './peutEffectuerUnChangement';

type OptionsChangement = {
  url: string;
  label: string;
  labelActions: string;
  permission: Role.Policy;
};

type Props<TDomain extends keyof AppelOffre.RèglesDemandesChangement> = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  domain: TDomain;
  modifier: OptionsChangement | undefined;
  demanderChangement: OptionsChangement | undefined;
  enregistrerChangement: OptionsChangement | undefined;
};

export const getAction = async <TDomain extends keyof AppelOffre.RèglesDemandesChangement>({
  identifiantProjet,
  rôle,
  domain,
  modifier,
  demanderChangement,
  enregistrerChangement,
}: Props<TDomain>) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

  const règlesChangement = cahierDesCharges.getRèglesChangements(domain);
  if (!règlesChangement.demande && !règlesChangement.informationEnregistrée) {
    return undefined;
  }

  if (!!modifier && rôle.aLaPermission(modifier.permission)) {
    return {
      url: modifier.url,
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
    rôle.aLaPermission(enregistrerChangement.permission) &&
    règlesChangement.informationEnregistrée
  ) {
    return {
      url: enregistrerChangement.url,
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
      url: demanderChangement.url,
      label: demanderChangement.label,
      labelActions: demanderChangement.labelActions,
    };
  }
};
