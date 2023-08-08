import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option, isNone, none } from '@potentiel/monads';

import { Find, TéléchargerFichierPort } from '../../common.port';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
  FichierDépôtAttestationGarantiesFinancièresReadModel,
} from '../dépôtGarantiesFinancières.readModel';

export type ConsulterFichierDépôtAttestationGarantiesFinancièreQuery = Message<
  'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<FichierDépôtAttestationGarantiesFinancièresReadModel>
>;

export type ConsulterFichierdépôtAttestationGarantiesFinancièresDependencies = {
  find: Find;
  téléchargerFichier: TéléchargerFichierPort;
};

export const registerConsulterFichierDépôtAttestationGarantiesFinancièresQuery = ({
  find,
  téléchargerFichier,
}: ConsulterFichierdépôtAttestationGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<
    ConsulterFichierDépôtAttestationGarantiesFinancièreQuery
  > = async ({ identifiantProjet }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: DépôtGarantiesFinancièresReadModelKey = `dépôt-garanties-financières|${rawIdentifiantProjet}`;
    const dépôtGarantiesFinancières = await find<DépôtGarantiesFinancièresReadModel>(key);

    if (
      isNone(dépôtGarantiesFinancières) ||
      !dépôtGarantiesFinancières.attestationConstitution ||
      !dépôtGarantiesFinancières.attestationConstitution.format
    ) {
      return none;
    }

    const content = await téléchargerFichier({
      type: 'depot-attestation-constitution-garanties-financieres',
      identifiantProjet: rawIdentifiantProjet,
      format: dépôtGarantiesFinancières.attestationConstitution.format,
    });

    if (!content) {
      return none;
    }

    return {
      type: 'dépôt-attestation-constitution-garanties-Financieres',
      format: dépôtGarantiesFinancières.attestationConstitution.format,
      content: content,
    } satisfies FichierDépôtAttestationGarantiesFinancièresReadModel;
  };
  mediator.register('CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES', queryHandler);
};
