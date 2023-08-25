import {
  ConsulterGarantiesFinancièresQuery,
  ConsulterDépôtGarantiesFinancièresQuery,
} from '@potentiel/domain-views';
import { isNone, isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';
import {
  GetProjectGarantiesFinancièresData,
  ProjectGarantiesFinancièresData,
} from '../../../../modules/garantiesFinancières';

//TO DO : après rebase de la branche garanties-financieres, utiliser cette query pour la page projet aussi

export const getProjectGarantiesFinancièresData: GetProjectGarantiesFinancièresData = async ({
  identifiantProjet,
  garantiesFinancièresSoumisesÀLaCandidature,
}) => {
  let actionRequise: ProjectGarantiesFinancièresData['actionRequise'];

  const garantiesFinancièresActuelles = await mediator.send<ConsulterGarantiesFinancièresQuery>({
    type: 'CONSULTER_GARANTIES_FINANCIÈRES',
    data: { identifiantProjet },
  });

  const garantiesFinancièresDéposées = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>(
    {
      type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: { identifiantProjet },
    },
  );

  // TO DO : retirer les cas de changement de producteur et GF échue
  if (garantiesFinancièresSoumisesÀLaCandidature) {
    if (isNone(garantiesFinancièresActuelles)) {
      actionRequise = 'enregistrer';
    } else {
      if (
        !garantiesFinancièresActuelles.typeGarantiesFinancières ||
        !garantiesFinancièresActuelles.attestationConstitution ||
        (garantiesFinancièresActuelles.typeGarantiesFinancières === "avec date d'échéance" &&
          !garantiesFinancièresActuelles.dateÉchéance)
      ) {
        actionRequise = 'compléter enregistrement';
      }
    }
  }

  // TO DO : ajouter les cas de changement de producteur et GF échue
  if (!garantiesFinancièresSoumisesÀLaCandidature && isNone(garantiesFinancièresActuelles)) {
    if (isNone(garantiesFinancièresDéposées)) {
      actionRequise = 'déposer';
    } else {
      if (
        !garantiesFinancièresDéposées.typeGarantiesFinancières ||
        !garantiesFinancièresDéposées.attestationConstitution ||
        (garantiesFinancièresDéposées.typeGarantiesFinancières === "avec date d'échéance" &&
          !garantiesFinancièresDéposées.dateÉchéance)
      ) {
        actionRequise = 'compléter dépôt';
      }
    }
  }

  return {
    actionRequise,
    ...(isSome(garantiesFinancièresActuelles) && { actuelles: garantiesFinancièresActuelles }),
    ...(isSome(garantiesFinancièresDéposées) && { dépôt: garantiesFinancièresDéposées }),
  };
};
