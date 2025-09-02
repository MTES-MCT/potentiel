import { mediator } from 'mediateur';
import { Metadata, ResolvingMetadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Accès, CahierDesCharges, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getProjet, getPériodeAppelOffres } from '@/app/_helpers';

import { getProjetÉliminé } from '../_helpers/getÉliminé';

import {
  DétailsProjetÉliminéActions,
  DétailsProjetÉliminéPage,
  DétailsProjetÉliminéPageProps,
} from './DétailsProjetÉliminé.page';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const candidature = await getProjet(decodeParameter(params.identifiant));

    return {
      title: `${candidature.nomProjet} - Potentiel`,
      description: "Détail de la page d'un projet",
    };
  } catch {
    return {};
  }
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const éliminé = await getProjetÉliminé(identifiantProjet.formatter());

      const demandeRecoursEnCours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const { appelOffres, famille, période } = await getPériodeAppelOffres(identifiantProjet);

      const cahierDesCharges = CahierDesCharges.bind({
        appelOffre: appelOffres,
        famille,
        période,
        cahierDesChargesModificatif: undefined,
        technologie: undefined,
      });
      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      return (
        <DétailsProjetÉliminéPage
          identifiantProjet={identifiantProjet.formatter()}
          éliminé={mapToProps({ éliminé, role: utilisateur.role })}
          utilisateursAyantAccèsAuProjet={Option.match(accèsProjet)
            .some((accèsProjet) =>
              accèsProjet.utilisateursAyantAccès.map((utilisateur) => utilisateur.formatter()),
            )
            .none(() => [])}
          actions={mapToActions({
            role: utilisateur.role,
            demandeRecoursEnCours,
            cahierDesChargesPermetDemandeRecours: cahierDesCharges.changementEstDisponible(
              'demande',
              'recours',
            ),
          })}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  éliminé: Éliminé.ConsulterÉliminéReadModel;
  role: Role.ValueType;
}) => DétailsProjetÉliminéPageProps['éliminé'];

const mapToProps: MapToProps = ({ éliminé, role }) => ({
  ...mapToPlainObject(éliminé),
  prixReference: role.aLaPermission('projet.accèsDonnées.prix') ? éliminé.prixReference : undefined,
});

type MapToActions = (args: {
  role: Role.ValueType;
  demandeRecoursEnCours: Option.Type<Éliminé.Recours.ConsulterRecoursReadModel>;
  cahierDesChargesPermetDemandeRecours: boolean;
}) => Array<DétailsProjetÉliminéActions>;

const mapToActions: MapToActions = ({
  role,
  demandeRecoursEnCours,
  cahierDesChargesPermetDemandeRecours,
}) => {
  const actions: Array<DétailsProjetÉliminéActions> = [];

  if (Option.isSome(demandeRecoursEnCours)) {
    if (role.aLaPermission('recours.consulter.détail')) {
      actions.push('consulter-demande-recours');
    }
  } else if (role.aLaPermission('recours.demander') && cahierDesChargesPermetDemandeRecours) {
    actions.push('faire-demande-recours');
  }

  if (role.aLaPermission('candidature.corriger')) {
    actions.push('modifier-candidature');
  }

  if (role.aLaPermission('candidature.attestation.télécharger')) {
    actions.push('télécharger-attestation-désignation');
  }

  if (
    role.aLaPermission('accès.autoriserAccèsProjet') ||
    role.aLaPermission('accès.retirerAccèsProjet')
  ) {
    actions.push('gérer-accès-au-projet');
  } else if (role.aLaPermission('accès.lister')) {
    actions.push('lister-accès-au-projet');
  }

  return actions;
};
