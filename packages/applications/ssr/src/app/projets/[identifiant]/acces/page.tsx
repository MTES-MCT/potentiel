import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Accès } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { AccèsListPage, AccèsListPageProps } from './AccèsList.page';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const nombreDeProjets = await getNombreProjets(utilisateur);

      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const props = mapToProps({
        accès: Option.match(accèsProjet)
          .some((accèsProjet) => accèsProjet.utilisateursAyantAccès)
          .none(() => []),
        utilisateurQuiInvite: utilisateur,
        identifiantProjet,
        nombreDeProjets,
        lauréat,
      });
      return (
        <AccèsListPage
          identifiantProjet={props.identifiantProjet}
          nombreDeProjets={props.nombreDeProjets}
          accès={props.accès}
          statut={props.statut}
        />
      );
    }),
  );
}

type MapToProps = (props: {
  identifiantProjet: IdentifiantProjet.ValueType;
  nombreDeProjets?: number;
  accès: Email.ValueType[];

  utilisateurQuiInvite: Utilisateur.ValueType;
  lauréat: Option.Type<Lauréat.ConsulterLauréatReadModel>;
}) => AccèsListPageProps;

const mapToProps: MapToProps = ({
  accès,
  identifiantProjet,
  nombreDeProjets,
  utilisateurQuiInvite,
  lauréat,
}) =>
  mapToPlainObject({
    accès: accès.map((identifiantUtilisateur) => ({
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
      peutRetirerAccès: !identifiantUtilisateur.estÉgaleÀ(
        utilisateurQuiInvite.identifiantUtilisateur,
      ),
    })),
    identifiantProjet: identifiantProjet.formatter(),
    nombreDeProjets,
    statut: Option.match(lauréat)
      .some(() => 'lauréat' as 'lauréat' | 'éliminé')
      .none(() => 'éliminé'),
  });

const getNombreProjets = async (utilisateur: Utilisateur.ValueType) => {
  if (!utilisateur.rôle.estPorteur()) {
    return undefined;
  }
  const accès = await mediator.send<Accès.ListerAccèsQuery>({
    type: 'Projet.Accès.Query.ListerAccès',
    data: {
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      range: {
        startPosition: 0,
        endPosition: 1,
      },
    },
  });

  return accès.total;
};
