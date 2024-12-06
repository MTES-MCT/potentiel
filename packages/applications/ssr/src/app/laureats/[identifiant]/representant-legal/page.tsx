import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

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
      const idProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

      const représentantLégal =
        await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: idProjet.formatter(),
          },
        });

      if (Option.isNone(représentantLégal)) {
        return notFound();
      }

      const props = mapToProps({
        identifiantProjet: idProjet,
        demande: représentantLégal.demande!,
        utilisateur,
      });

      return (
        <DétailsDemandeChangementReprésentantLégalPage
          identifiantProjet={props.identifiantProjet}
          statut={props.statut}
          nomReprésentantLégal={props.nomReprésentantLégal}
          typeReprésentantLégal={props.typeReprésentantLégal}
          pièceJustificative={props.pièceJustificative}
          demandéLe={props.demandéLe}
          demandéPar={props.demandéPar}
          actions={props.actions}
          role={props.role}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  demande: ReprésentantLégal.ConsulterReprésentantLégalReadModel['demande'];
  utilisateur: Utilisateur.ValueType;
}) => DétailsDemandeChangementReprésentantLégalPageProps;

const mapToProps: MapToProps = ({ identifiantProjet, demande, utilisateur }) => ({
  identifiantProjet: mapToPlainObject(identifiantProjet),
  statut: mapToPlainObject(demande!.statut),
  nomReprésentantLégal: demande!.nomReprésentantLégal,
  typeReprésentantLégal: mapToPlainObject(demande!.typeReprésentantLégal),
  pièceJustificative: DocumentProjet.convertirEnValueType(
    identifiantProjet.formatter(),
    ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
    demande!.demandéLe.formatter(),
    demande!.pièceJustificative.format,
  ),
  demandéLe: mapToPlainObject(demande!.demandéLe),
  demandéPar: mapToPlainObject(demande!.demandéPar),
  role: mapToPlainObject(utilisateur.role),
  actions: [],
});
