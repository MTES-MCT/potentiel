import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  DétailsDemandeChangementReprésentantLégalPage,
  DétailsDemandeChangementReprésentantLégalPageProps,
} from '@/components/pages/représentant-légal/changement/détails/DétailsDemandeChangementReprésentantLégal.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: 'Détail du représentant légal du projet - Potentiel',
  description: "Détail du représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const représentantLégal =
        await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(représentantLégal)) {
        return notFound();
      }

      const {} = mapToProps({
        identifiantProjet,
        représentantLégal,
        utilisateur,
      });

      return (
        <DétailsDemandeChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          nomReprésentantLégal={représentantLégal.nomReprésentantLégal}
          typeReprésentantLégal={mapToPlainObject(représentantLégal.typeReprésentantLégal)}
          demande={représentantLégal.demande}
          role={utilisateur.role}
        />
      );
    }),
  );
}
type MapToProps = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  représentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  utilisateur: Utilisateur.ValueType;
}) => DétailsDemandeChangementReprésentantLégalPageProps;
const mapToProps: MapToProps = ({ identifiantProjet, représentantLégal, utilisateur }) => ({
  identifiantProjet: mapToPlainObject(identifiantProjet),
  nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
  typeReprésentantLégal: mapToPlainObject(représentantLégal.typeReprésentantLégal),
  role: mapToPlainObject(utilisateur.role),
  demande: représentantLégal.demande
    ? {
        statut: mapToPlainObject(représentantLégal.demande.statut),
        nomReprésentantLégal: représentantLégal.demande.nomReprésentantLégal,
        typeReprésentantLégal: mapToPlainObject(représentantLégal.demande.typeReprésentantLégal),
        demandéLe: mapToPlainObject(représentantLégal.demande.demandéLe),
        demandéPar: mapToPlainObject(représentantLégal.demande.demandéPar),
      }
    : undefined,
  actions: [],
});
