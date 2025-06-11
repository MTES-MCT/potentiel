import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { InvalidOperationError, mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { EnregistrerChangementFournisseurPage } from '@/components/pages/fournisseur/changement/enregistrer/EnregistrerChangementFournisseur.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const metadata: Metadata = {
  title: 'Changer le fournisseur du projet - Potentiel',
  description: 'Formulaire de changement de fournisseur du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(fournisseur)) {
      return notFound();
    }

    const technologie = await getTechnologie(identifiantProjet);

    if (technologie === 'N/A') {
      throw new InvalidOperationError(`Le type de technologie de ce projet est inconnu`);
    }

    if (technologie === 'hydraulique') {
      throw new InvalidOperationError(
        `Le type de technologie de ce projet ne permet pas un changement de fournisseur`,
      );
    }

    return (
      <EnregistrerChangementFournisseurPage
        identifiantProjet={mapToPlainObject(fournisseur.identifiantProjet)}
        fournisseurs={mapToPlainObject(fournisseur.fournisseurs)}
        évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
        typesFournisseur={
          technologie === 'eolien'
            ? Lauréat.Fournisseur.TypeFournisseur.typesFournisseurEolien
            : Lauréat.Fournisseur.TypeFournisseur.typesFournisseurPV
        }
        technologie={technologie}
      />
    );
  });
}

const getTechnologie = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);

  if (appelOffres.technologie) {
    return appelOffres.technologie;
  }
  const { technologie } = await getCandidature(identifiantProjet.formatter());

  return technologie.type;
};
