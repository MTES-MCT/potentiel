import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { EnregistrerChangementFournisseurPage } from '@/components/pages/fournisseur/changement/enregistrer/EnregistrerChangementFournisseur.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

import { getTechnologie } from '../../_helpers/getTechnologie';

export const metadata: Metadata = {
  title: 'Changer le fournisseur du projet - Potentiel',
  description: 'Formulaire de changement de fournisseur du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const candidature = await getCandidature(identifiantProjet.formatter());
    const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);
    const technologie = getTechnologie({ appelOffres, technologie: candidature.technologie });

    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(fournisseur)) {
      return notFound();
    }

    return (
      <EnregistrerChangementFournisseurPage
        identifiantProjet={mapToPlainObject(fournisseur.identifiantProjet)}
        fournisseurs={mapToPlainObject(fournisseur.fournisseurs)}
        évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
        évaluationCarboneSimplifiéeInitiale={candidature.evaluationCarboneSimplifiée}
        technologie={technologie}
      />
    );
  });
}
