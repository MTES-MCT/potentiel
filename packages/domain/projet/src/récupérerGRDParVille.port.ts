import { Option } from '@potentiel-libraries/monads';

export type RécupererGRDParVillePort = (props: { codePostal: string; commune: string }) => Promise<
  Option.Type<{
    raisonSociale: string;
    codeEIC: string;
  }>
>;
