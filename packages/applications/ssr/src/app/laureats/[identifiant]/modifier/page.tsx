import { Metadata } from 'next';

import { Candidature } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';
import {
  ModifierLauréatPage,
  ModifierLauréatPageProps,
} from '@/components/pages/lauréat/modifier/ModifierLauréat.page';

import { getCandidature } from '../../../candidatures/_helpers/getCandidature';
import { GetLauréat, getLauréat } from '../_helpers/getLauréat';

export const metadata: Metadata = {
  title: 'Page de modification des lauréats - Potentiel',
  description: 'Page de modification des lauréats',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      const candidature = await getCandidature(identifiantProjet);
      const lauréat = await getLauréat({
        identifiantProjet,
        sociétéMère: candidature.sociétéMère,
      });

      const props = mapToProps(candidature, lauréat, identifiantProjet);

      return (
        <ModifierLauréatPage
          candidature={props.candidature}
          lauréat={props.lauréat}
          projet={props.projet}
        />
      );
    }),
  );
}

type MapToProps = (
  candidature: Candidature.ConsulterCandidatureReadModel,
  lauréat: GetLauréat,
  identifiantProjet: string,
) => ModifierLauréatPageProps;

const mapToProps: MapToProps = (candidature, lauréat, identifiantProjet) => ({
  candidature: {
    societeMere: candidature.sociétéMère,
  },
  lauréat,
  projet: {
    nomProjet: candidature.nomProjet,
    identifiantProjet,
  },
});
