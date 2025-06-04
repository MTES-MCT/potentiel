import { mediator } from 'mediateur';
import { Metadata, ResolvingMetadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Candidature, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  DétailsProjetÉliminéActions,
  DétailsProjetÉliminéPage,
  DétailsProjetÉliminéPageProps,
} from '@/components/pages/projet/éliminé/détails/DétailsProjetÉliminé.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

import { getProjetÉliminé } from './_helpers/getÉliminé';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const candidature = await getCandidature(decodeParameter(params.identifiant));

  return {
    title: `${candidature.nomProjet} - Potentiel`,
    description: "Détail de la page d'un projet",
  };
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await getProjetÉliminé(identifiantProjet.formatter());

      const candidature = await getCandidature(identifiantProjet.formatter());

      const demandeRecoursEnCours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const { appelOffres, période } = await getPériodeAppelOffres(identifiantProjet);

      return (
        <DétailsProjetÉliminéPage
          identifiantProjet={identifiantProjet}
          candidature={mapToCandidatureProps({ candidature, role: utilisateur.role })}
          unitéPuissance={appelOffres.unitePuissance}
          actions={mapToActions({
            utilisateur,
            demandeRecoursEnCours,
            changementDeCahierDesChargeNécessairePourDemanderUnRecours:
              période.choisirNouveauCahierDesCharges ?? false,
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
