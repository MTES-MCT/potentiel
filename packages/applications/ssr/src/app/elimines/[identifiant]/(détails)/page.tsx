import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Accès, CahierDesCharges, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers';
import { getÉliminé } from '@/app/_helpers/getÉliminé';

import {
  DétailsProjetÉliminéActions,
  DétailsProjetÉliminéPage,
  DétailsProjetÉliminéPageProps,
} from './DétailsProjetÉliminé.page';

type PageProps = { params: { identifiant: string; date: string } };

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const dateDemande = DateTime.convertirEnValueType(decodeParameter(date));

      const éliminé = await getÉliminé(identifiantProjet.formatter());
      if (!éliminé) {
        notFound();
      }

      const demandeRecoursEnCours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateDemandeValue: dateDemande.formatter(),
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
          éliminé={mapToProps({ éliminé, role: utilisateur.rôle })}
          utilisateursAyantAccèsAuProjet={Option.match(accèsProjet)
            .some((accèsProjet) =>
              accèsProjet.utilisateursAyantAccès.map((utilisateur) => utilisateur.formatter()),
            )
            .none(() => [])}
          actions={mapToActions({
            role: utilisateur.rôle,
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
  demandeRecoursEnCours: Option.Type<Éliminé.Recours.ConsulterDemandeRecoursReadModel>;
  cahierDesChargesPermetDemandeRecours: boolean;
}) => Array<DétailsProjetÉliminéActions>;

const mapToActions: MapToActions = ({
  role,
  demandeRecoursEnCours,
  cahierDesChargesPermetDemandeRecours,
}) => {
  const actions: Array<DétailsProjetÉliminéActions> = [];

  if (Option.isSome(demandeRecoursEnCours)) {
    if (
      demandeRecoursEnCours.statut.estRejeté() &&
      cahierDesChargesPermetDemandeRecours &&
      role.aLaPermission('recours.demander')
    ) {
      actions.push('faire-demande-recours');
    } else if (role.aLaPermission('recours.consulter.détail')) {
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
