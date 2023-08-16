import { EtapeGFSupprimée } from '../../../../../modules/project';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

/* 
Cet événement EtapeGFSupprimée n'a pas de valeur métier et a été introduit pour corriger des projets non soumis à GF
Une alernative aurait été d'archiver dans l'eventStore les events ProjectGFDueDateSet ou bien d'utiliser l'event ProjectGFDueDateCancelled
*/

export const onEtapeGFSupprimée: EventHandler<EtapeGFSupprimée> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projetId },
  } = évènement;

  await GarantiesFinancières.destroy({ where: { projetId }, transaction });
};
