import { Metadata, ResolvingMetadata } from 'next';
import { match } from 'ts-pattern';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import {
  DétailsCandidaturePage,
  DétailsCandidaturePageProps,
} from '@/components/pages/candidature/détails/DétailsCandidature.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getCandidature } from '../_helpers/getCandidature';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  const candidature = await getCandidature(identifiantProjet);

  return {
    title: `Candidature ${candidature.nomProjet} - Potentiel`,
    description: 'Détails de la candidature',
  };
}

export default async function Page({ params }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(params.identifiant);
      const candidature = await getCandidature(identifiantProjet);
      return (
        <DétailsCandidaturePage
          candidature={mapToPlainObject(candidature)}
          actions={mapToActions({
            estNotifiée: !!candidature.notification,
            aUneAttestation: candidature.notification?.attestation !== undefined,
            role: utilisateur.role,
          })}
        />
      );
    }),
  );
}

type ActionsProps = {
  estNotifiée: boolean;
  aUneAttestation: boolean;
  role: Role.ValueType;
};

const mapToActions = ({ estNotifiée, aUneAttestation, role }: ActionsProps) => {
  const defaultActions = {
    corriger: role.aLaPermission('candidature.corriger'),
  };
  return match({ estNotifiée })
    .returnType<DétailsCandidaturePageProps['actions']>()
    .with({ estNotifiée: true }, () => ({
      ...defaultActions,
      prévisualiserAttestation: false,
      téléchargerAttestation: aUneAttestation,
    }))
    .otherwise(() => ({
      ...defaultActions,
      prévisualiserAttestation:
        role.aLaPermission('candidature.attestation.prévisualiser') && aUneAttestation,
      téléchargerAttestation: false,
    }));
};
