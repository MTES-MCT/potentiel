import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  DétailsRaccordementPage,
  DétailsRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/détails/DétailsRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Raccordement du projet - Potentiel',
  description: 'Raccordement du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const projet = await récupérerProjet(identifiantProjet.formatter());

      await vérifierQueLeProjetEstClassé({
        statut: projet.statut,
        message: "Vous ne pouvez pas consulter le raccordement d'un projet éliminé ou abandonné",
      });

      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
        return redirect(
          Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet.formatter()),
        );
      }

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau:
              raccordement.identifiantGestionnaireRéseau?.formatter() || '',
          },
        });

      const lienRetour = utilisateur.role.estÉgaleÀ(Role.grd)
        ? {
            label: 'Retour vers les raccordements',
            href: Routes.Raccordement.lister,
          }
        : {
            label: 'Retour vers le projet',
            href: Routes.Projet.details(identifiantProjet.formatter()),
          };

      return (
        <DétailsRaccordementPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
          raccordement={mapToPlainObject(raccordement)}
          actions={mapToActions(utilisateur, raccordement)}
          lienRetour={lienRetour}
        />
      );
    }),
  );
}

const mapToActions = (
  { role }: Utilisateur.ValueType,
  raccordement: Raccordement.ConsulterRaccordementReadModel,
): DétailsRaccordementPageProps['actions'] => {
  const isGestionnaireInconnu =
    raccordement.identifiantGestionnaireRéseau &&
    raccordement.identifiantGestionnaireRéseau.estÉgaleÀ(
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    );
  if (isGestionnaireInconnu) {
    return {
      supprimer: true,
      gestionnaireRéseau: {
        modifier: true,
      },
      demandeComplèteRaccordement: {
        modifierRéférence: false,
        transmettre: false,
        modifier: false,
      },
      miseEnService: {
        transmettre: false,
        modifier: false,
      },
      propositionTechniqueEtFinancière: {
        transmettre: false,
        modifier: false,
      },
    };
  }
  return {
    supprimer: role.aLaPermission('réseau.raccordement.dossier.supprimer'),
    demandeComplèteRaccordement: {
      modifierRéférence:
        role.aLaPermission('réseau.raccordement.référence-dossier.modifier') &&
        !role.aLaPermission('réseau.raccordement.demande-complète-raccordement.modifier'),
      transmettre: role.aLaPermission(
        'réseau.raccordement.demande-complète-raccordement.transmettre',
      ),
      modifier: role.aLaPermission('réseau.raccordement.demande-complète-raccordement.modifier'),
    },
    propositionTechniqueEtFinancière: {
      transmettre: role.aLaPermission(
        'réseau.raccordement.proposition-technique-et-financière.transmettre',
      ),
      modifier: role.aLaPermission(
        'réseau.raccordement.proposition-technique-et-financière.modifier',
      ),
    },
    miseEnService: {
      transmettre: role.aLaPermission('réseau.raccordement.date-mise-en-service.transmettre'),
      modifier: role.aLaPermission('réseau.raccordement.date-mise-en-service.modifier'),
    },
    gestionnaireRéseau: {
      modifier: role.aLaPermission('réseau.raccordement.gestionnaire.modifier'),
    },
  };
};
