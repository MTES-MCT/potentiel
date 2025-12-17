import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Accès, CahierDesCharges, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers';
import { getÉliminé } from '@/app/_helpers/getÉliminé';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import {
  DétailsProjetÉliminéActions,
  DétailsProjetÉliminéPage,
  DétailsProjetÉliminéPageProps,
} from './DétailsProjetÉliminé.page';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const éliminé = await getÉliminé(identifiantProjet.formatter());
      if (!éliminé) {
        notFound();
      }

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const { appelOffres, famille, période } = await getPériodeAppelOffres(
        identifiantProjet.formatter(),
      );

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
          éliminé={mapToProps({ éliminé, role: utilisateur.rôle })}
          utilisateursAyantAccèsAuProjet={Option.match(accèsProjet)
            .some((accèsProjet) =>
              accèsProjet.utilisateursAyantAccès.map((utilisateur) => utilisateur.formatter()),
            )
            .none(() => [])}
          actions={mapToActions({
            role: utilisateur.rôle,
            recours,
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
  recours: Option.Type<Éliminé.Recours.ConsulterRecoursReadModel>;
  cahierDesChargesPermetDemandeRecours: boolean;
}) => Array<DétailsProjetÉliminéActions>;

const mapToActions: MapToActions = ({ role, recours, cahierDesChargesPermetDemandeRecours }) => {
  const actions: Array<DétailsProjetÉliminéActions> = [];

  if (Option.isSome(recours)) {
    if (recours.statut.estEnCours() && role.aLaPermission('recours.consulter.détail')) {
      actions.push('consulter-demande-recours');
    } else if (role.aLaPermission('recours.demander')) {
      actions.push('faire-demande-recours');
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
