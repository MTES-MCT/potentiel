import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DétailsDemandeChangementReprésentantLégalPage } from '@/components/pages/représentant-légal/changement/détails/DétailsDemandeChangementReprésentantLégal.page';
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

      if (Option.isNone(représentantLégal) || !représentantLégal.demande) {
        return notFound();
      }

      const {
        statut,
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      } = représentantLégal.demande;

      return (
        <DétailsDemandeChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          statut={mapToPlainObject(statut)}
          nomReprésentantLégal={nomReprésentantLégal}
          typeReprésentantLégal={mapToPlainObject(typeReprésentantLégal)}
          pièceJustificative={DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
            demandéLe.formatter(),
            pièceJustificative.format,
          )}
          demandéLe={mapToPlainObject(demandéLe)}
          demandéPar={mapToPlainObject(demandéPar)}
          role={mapToPlainObject(utilisateur.role)}
          actions={[]}
        />
      );
    }),
  );
}
