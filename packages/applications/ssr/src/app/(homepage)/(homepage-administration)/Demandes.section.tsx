import Contract from '@codegouvfr/react-dsfr/picto/Contract';
import { mediator } from 'mediateur';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat, Éliminé } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandesDétails } from './Demandes.détails';

const sectionTitle = 'Demandes à traiter';

export const DemandesSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const { withNew, withNoNew } = await getDemandes(utilisateur);
      const autorité = utilisateur.estDreal() ? 'dgec' : 'dreal';

      return (
        <Section
          title={sectionTitle}
          picto={<Contract color="yellow-moutarde" fontSize="large" />}
          className="border-none"
        >
          <DemandesDétails withNew={withNew} withNoNew={withNoNew} autorité={autorité} />
        </Section>
      );
    }),
    sectionTitle,
  );

const getDemandes = async (utilisateur: PotentielUtilisateur) => {
  const ilYAUnMois = DateTime.now().retirerNombreDeMois(1);

  const abandon = await mediator.send<Lauréat.Abandon.ListerDemandesAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ListerDemandesAbandon',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['confirmé', 'confirmation-demandée', 'demandé', 'en-instruction'],
      autoritéCompétente: 'dreal',
    },
  });

  const actionnaire = await mediator.send<Lauréat.Actionnaire.ListerChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['demandé'],
    },
  });

  const représentantLégal =
    await mediator.send<Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
      data: {
        utilisateur: utilisateur.identifiantUtilisateur.email,
        statut: ['demandé'],
      },
    });

  const puissance = await mediator.send<Lauréat.Puissance.ListerChangementPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ListerChangementPuissance',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['demandé'],
    },
  });

  const délai = await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
    type: 'Lauréat.Délai.Query.ListerDemandeDélai',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statuts: ['demandé', 'en-instruction'],
    },
  });

  // viovio autorité compétente ?
  const recours = await mediator.send<Éliminé.Recours.ListerDemandeRecoursQuery>({
    type: 'Éliminé.Recours.Query.ListerDemandeRecours',
    data: {
      utilisateur: utilisateur.identifiantUtilisateur.email,
      statut: ['demandé', 'en-instruction'],
    },
  });

  const mappedDemandes = (
    [
      ['abandon', abandon],
      ['actionnaire', actionnaire],
      ['représentantLégal', représentantLégal],
      ['puissance', puissance],
      ['délai', délai],
      ['recours', recours],
    ] as const
  ).map(([domain, résultat]) => ({
    domain,
    total: résultat.total,
    new: résultat.items.filter((d) => d.demandéLe.estUltérieureÀ(ilYAUnMois)).length,
  }));

  return {
    withNew: mappedDemandes.filter((demande) => demande.new > 0),
    withNoNew: mappedDemandes.filter((demande) => demande.new === 0),
  };
};
