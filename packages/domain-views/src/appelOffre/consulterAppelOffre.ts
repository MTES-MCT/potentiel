import { Option } from '@potentiel/monads';
import { RawIdentifiantAppelOffre } from '@potentiel/domain';
import { AppelOffre } from './appelOffre.readModel';

export const consulterAppelOffre = (identifiantAppelOffre: RawIdentifiantAppelOffre) =>
  Promise<Option<AppelOffre>>;
