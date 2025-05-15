import { match } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';

import { DétailsCandidaturePageProps } from '@/components/pages/candidature/détails/DétailsCandidature.page';

export const getCandidatureActions = (
  props: { estNotifiée: boolean; estLauréat: boolean; aUneAttestation: boolean },
  role: Role.ValueType,
): DétailsCandidaturePageProps['actions'] => {
  const defaultActions = {
    corriger: role.aLaPermission('candidature.corriger'),
    modifierLauréat: false,
    prévisualiserAttestation: false,
    téléchargerAttestation: false,
  };

  return match(props)
    .returnType<DétailsCandidaturePageProps['actions']>()
    .with({ estNotifiée: false }, () => ({
      ...defaultActions,
      prévisualiserAttestation: role.aLaPermission('candidature.attestation.prévisualiser'),
    }))
    .with({ aUneAttestation: true, estNotifiée: true, estLauréat: false }, () => ({
      ...defaultActions,
      téléchargerAttestation: true,
    }))
    .with({ aUneAttestation: true, estNotifiée: true, estLauréat: true }, () => ({
      ...defaultActions,
      téléchargerAttestation: true,
      corriger: false,
      modifierLauréat: role.aLaPermission('lauréat.modifier'),
    }))
    .otherwise(() => defaultActions);
};
