import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';

export type TrouverProjetsParIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string,
) => ResultAsync<Array<string>, InfraNotAvailableError>;
