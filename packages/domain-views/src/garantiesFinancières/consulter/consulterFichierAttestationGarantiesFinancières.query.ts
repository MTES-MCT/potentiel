import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option, isNone, none } from '@potentiel/monads';

import { Find } from '../../common.port';
import { TéléchargerAttestationGarantiesFinancièresPort } from '../garantiesFinancières.ports';
import {
  FichierAttestationGarantiesFinancièresReadModel,
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from '../garantiesFinancières.readModel';

export type ConsulterFichierAttestationGarantiesFinancièreQuery = Message<
  'CONSULTER_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<FichierAttestationGarantiesFinancièresReadModel>
>;

export type ConsulterFichierAttestationGarantiesFinancièresDependencies = {
  find: Find;
  téléchargerFichier: TéléchargerAttestationGarantiesFinancièresPort;
};

export const registerConsulterFichierAttestationGarantiesFinancièresQuery = ({
  find,
  téléchargerFichier,
}: ConsulterFichierAttestationGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<ConsulterFichierAttestationGarantiesFinancièreQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: GarantiesFinancièresReadModelKey = `garanties-financières#${rawIdentifiantProjet}`;
    const garantiesFinancières = await find<GarantiesFinancièresReadModel>(key);

    if (
      isNone(garantiesFinancières) ||
      !garantiesFinancières.attestationConstitution ||
      !garantiesFinancières.attestationConstitution.format
    ) {
      return none;
    }

    const content = await téléchargerFichier({
      type: 'attestation-constitution-garanties-Financieres',
      identifiantProjet: rawIdentifiantProjet,
      format: garantiesFinancières.attestationConstitution.format,
    });

    if (!content) {
      return none;
    }

    return {
      type: 'attestation-constitution-garanties-Financieres',
      format: garantiesFinancières.attestationConstitution.format,
      content: content,
    } satisfies FichierAttestationGarantiesFinancièresReadModel;
  };
  mediator.register('CONSULTER_ATTESTATION_GARANTIES_FINANCIÈRES', queryHandler);
};
