import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';
import { mediator } from 'mediateur';

import { CahierDesCharges, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { getPériodeAppelOffres } from '../../../../_helpers';

export type MenuItem = SideMenuProps.Item;

type GetÉliminéMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

const link = (text: string, href: string) => ({ linkProps: { href }, text });

export const getÉliminéMenuItems = async ({
  identifiantProjet,
  utilisateur,
}: GetÉliminéMenuItemsProps): Promise<SideMenuProps.Item[]> => {
  const utilisateursMenu = utilisateur.rôle.aLaPermission('accès.consulter')
    ? link('Utilisateurs', `${Routes.Éliminé.détails(identifiantProjet.formatter())}/utilisateurs`)
    : undefined;

  const actions = await getÉliminéActions({
    identifiantProjet,
    role: utilisateur.rôle,
  });

  return [
    link('Tableau de bord', `${Routes.Éliminé.détails(identifiantProjet.formatter())}`),
    utilisateursMenu,
    ...actions,
  ].filter((item) => !!item);
};

type GetÉliminéActionsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  role: Role.ValueType;
};

const getÉliminéActions = async ({
  identifiantProjet,
  role,
}: GetÉliminéActionsProps): Promise<Array<SideMenuProps.Item>> => {
  const actions: SideMenuProps.Item[] = [];

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

  if (Option.isSome(recours)) {
    if (recours.statut.estEnCours() && role.aLaPermission('recours.consulter.détail')) {
      actions.push(
        link(
          'Consulter le recours',
          `${Routes.Éliminé.détails(identifiantProjet.formatter())}/recours`,
        ),
      );
    }
  } else if (
    role.aLaPermission('recours.demander') &&
    cahierDesCharges.changementEstDisponible('demande', 'recours')
  ) {
    actions.push(
      link(
        'Demander un recours',
        `${Routes.Éliminé.détails(identifiantProjet.formatter())}/recours/demander`,
      ),
    );
  }

  if (role.aLaPermission('candidature.corriger')) {
    actions.push(
      link(
        'Modifier la candidature',
        `${Routes.Candidature.corriger(identifiantProjet.formatter())}`,
      ),
    );
  }

  return actions;
};
