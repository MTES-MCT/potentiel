import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type GetCandidatureForProjectPage = {
  emailContact: string;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

const defaultValue = 'Non renseigné à la candidature';

export const getCandidature = async ({
  identifiantProjet,
}: Props): Promise<GetCandidatureForProjectPage> => {
  try {
    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    return {
      emailContact: Option.isSome(candidature)
        ? candidature.emailContact.formatter()
        : defaultValue,
    };
  } catch (error) {
    getLogger().error(error);
    return { emailContact: defaultValue };
  }
};
