import { mediator } from 'mediateur';

import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '../../../../../_helpers';
import { checkLauréatSansAbandonOuAchèvement } from '../../../_helpers/checkLauréatSansAbandonOuAchèvement';
import { ChampsAvecAction } from '../../../_helpers/types';

export type GetEvaluationCarboneForProjectPage = {
  fournisseurs: ChampsAvecAction<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>;
  évaluationCarbone: ChampsAvecAction<number>;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getEvaluationCarbone = async ({ identifiantProjet, rôle }: Props) => {
  const estUnLauréatSansAbandonOuAchèvement =
    await checkLauréatSansAbandonOuAchèvement(identifiantProjet);
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
    type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isSome(fournisseur)) {
    return undefined;
  }
  // const { fournisseurs, évaluationCarboneSimplifiée } = fournisseur;

  // const { peutModifier, peutEnregistrerChangement } =
  //   await checkAutorisationChangement<'fournisseur'>({
  //     rôle: Role.convertirEnValueType(rôle),
  //     aUnAbandonEnCours,
  //     estAbandonné,
  //     estAchevé,
  //     règlesChangementPourAppelOffres,
  //     domain: 'fournisseur',
  //   });

  // règle spécifique à AOS, à rapatrier dans les règles métier présentes dans les AO si besoin
  // @ régler pour la V1
  // const estPetitPV = identifiantProjet.appelOffre === 'PPE2 - Petit PV Bâtiment';

  // const affichage = estPetitPV
  //   ? undefined
  //   : peutModifier
  //     ? {
  //         url: Routes.Fournisseur.modifier(identifiantProjet.formatter()),
  //         label: 'Modifier',
  //         labelActions: 'Modifier le fournisseur',
  //       }
  //     : peutEnregistrerChangement
  //       ? {
  //           url: Routes.Fournisseur.changement.enregistrer(identifiantProjet.formatter()),
  //           label: 'Changer de fournisseur',
  //           labelActions: 'Changer de fournisseur',
  //         }
  //       : undefined;
};
