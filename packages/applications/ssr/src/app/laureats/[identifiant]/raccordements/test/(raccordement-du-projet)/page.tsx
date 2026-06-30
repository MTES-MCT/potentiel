import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../../(raccordement-du-projet)/(détails)/_helpers';
import { DétailsRaccordementDuProjetPage } from './DétailsRaccordementDuProjetPage';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = { title: 'Raccordement du projet' };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const lauréat = await getLauréatOrRedirect(identifiantProjet.formatter());

      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
        return redirect(
          utilisateur.rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre')
            ? Routes.Raccordement.transmettreDemandeComplèteRaccordement(
                identifiantProjet.formatter(),
              )
            : Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter()),
        );
      }

      const lienRetour = utilisateur.estGrd()
        ? Routes.Raccordement.lister
        : Routes.Projet.details(identifiantProjet.formatter());

      return (
        <DétailsRaccordementDuProjetPage
          identifiantProjet={identifiantProjet.formatter()}
          lienRetour={lienRetour}
          estProjetAchevé={lauréat.statut.estAchevé()}
        />
      );
    }),
  );
}
