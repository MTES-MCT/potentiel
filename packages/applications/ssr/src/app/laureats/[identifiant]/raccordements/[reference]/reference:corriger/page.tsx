import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { CorrigerRéférenceDossierPage } from '@/components/pages/réseau/raccordement/corriger/CorrigerRéférenceDossier.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: 'Corriger une référence de dossier de raccordement - Potentiel',
  description: `Formulaire de modification d'une référence dossier de raccordement`,
};

type PageProps = IdentifiantParameter & {
  params: {
    reference: string;
  };
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async ({ role }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const projet = await récupérerProjet(identifiantProjet.formatter());
      await vérifierQueLeProjetEstClassé({
        statut: projet.statut,
        message:
          "Vous ne pouvez pas modifier la demande complète de raccordement d'un dossier de raccordement pour un projet éliminé ou abandonné",
      });

      const referenceDossierRaccordement = decodeParameter(reference);

      const gestionnaireRéseau =
        await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      if (Option.isNone(gestionnaireRéseau)) {
        return notFound();
      }

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      return (
        <CorrigerRéférenceDossierPage
          identifiantProjet={identifiantProjet.formatter()}
          gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
          dossierRaccordement={mapToPlainObject(dossierRaccordement)}
          lienRetour={
            role.aLaPermission('réseau.raccordement.consulter')
              ? Routes.Raccordement.détail(identifiantProjet.formatter())
              : Routes.Raccordement.lister
          }
        />
      );
    }),
  );
}
