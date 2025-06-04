import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Candidature, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  DétailsProjetÉliminéActions,
  DétailsProjetÉliminéPage,
  DétailsProjetÉliminéPageProps,
} from '@/components/pages/projet/éliminé/détails/DétailsProjetÉliminé.page';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(éliminé)) {
    return notFound();
  }

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    return notFound();
  }

  return {
    title: `Détail de la page du projet ${candidature.nomProjet} - Potentiel`,
    description: "Détail de la page d'un projet",
  };
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
        type: 'Éliminé.Query.ConsulterÉliminé',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(éliminé)) {
        return notFound();
      }

      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(candidature)) {
        return notFound();
      }

      const demandeRecoursEnCours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantProjet.appelOffre,
        },
      });

      if (Option.isNone(appelOffre)) {
        return notFound();
      }

      return (
        <DétailsProjetÉliminéPage
          identifiantProjet={identifiantProjet}
          candidature={mapToCandidatureProps({ candidature, role: utilisateur.role })}
          unitéPuissance={appelOffre.unitePuissance}
          actions={mapToActions({
            utilisateur,
            demandeRecoursEnCours,
            changementDeCahierDesChargeNécessairePourDemanderUnRecours:
              appelOffre.periodes.find((p) => p.id === identifiantProjet.période)
                ?.choisirNouveauCahierDesCharges ?? false,
          })}
        />
      );
    }),
  );
}

type MapToCandidatureProps = (args: {
  candidature: Candidature.ConsulterCandidatureReadModel;
  role: Role.ValueType;
}) => DétailsProjetÉliminéPageProps['candidature'];

const mapToCandidatureProps: MapToCandidatureProps = ({
  candidature: {
    nomCandidat,
    emailContact,
    localité,
    nomReprésentantLégal,
    sociétéMère,
    prixReference,
    puissanceProductionAnnuelle,
  },
  role,
}) => ({
  localité,
  nomCandidat,
  emailContact,
  nomReprésentantLégal,
  sociétéMère,
  prixReference: role.estCaisseDesDépôts() ? undefined : prixReference,
  puissanceProductionAnnuelle,
});

type MapToActions = (args: {
  utilisateur: Utilisateur.ValueType;
  demandeRecoursEnCours: Option.Type<Éliminé.Recours.ConsulterRecoursReadModel>;
  changementDeCahierDesChargeNécessairePourDemanderUnRecours: boolean;
}) => Array<DétailsProjetÉliminéActions>;

const mapToActions: MapToActions = ({
  utilisateur,
  demandeRecoursEnCours,
  changementDeCahierDesChargeNécessairePourDemanderUnRecours,
}) => {
  const actions: Array<DétailsProjetÉliminéActions> = [];

  if (
    utilisateur.role.aLaPermission('recours.demander') &&
    Option.isNone(demandeRecoursEnCours) &&
    !changementDeCahierDesChargeNécessairePourDemanderUnRecours
  ) {
    actions.push('faire-demande-recours');
  }

  if (utilisateur.role.aLaPermission('candidature.corriger')) {
    actions.push('modifier-candidature');
  }

  if (utilisateur.role.aLaPermission('candidature.attestation.télécharger')) {
    actions.push('télécharger-attestation-désignation');
  }

  return actions;
};
