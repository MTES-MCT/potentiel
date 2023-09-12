import { IdentifiantProjetValueType } from '../domain.valueType';
import { Option } from '@potentiel/monads';

export type RécupérerLesPorteursÀNotifierPort = (data: {
  identifiantProjet: IdentifiantProjetValueType;
}) => Promise<Option<Array<{ email: string; name: string }>>>;
