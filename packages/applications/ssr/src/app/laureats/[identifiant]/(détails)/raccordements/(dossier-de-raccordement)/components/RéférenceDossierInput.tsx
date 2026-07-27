import Input from '@codegouvfr/react-dsfr/Input';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import Link from 'next/link';

import { ExpressionRegulière } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';

type Props = {
  name: string;
  defaultValue?: string;
  aideSaisie:
    | PlainType<{
        format?: string;
        légende?: string;
        expressionReguliere?: ExpressionRegulière.ValueType;
      }>
    | undefined;
  validationErrors: Record<string, string>;
};

export const RéférenceDossierInput = ({
  name,
  aideSaisie,
  validationErrors,
  defaultValue,
}: Props) => {
  const expressionRégulière =
    aideSaisie?.expressionReguliere?.expression ?? ExpressionRegulière.accepteTout.expression;

  return (
    <Input
      label={
        <>
          <span>Référence du dossier de raccordement du projet</span>
          <RéférenceDossierTooltip />
        </>
      }
      hintText={
        <>
          {aideSaisie?.format && (
            <div className="m-0">Exemple de format attendu : {aideSaisie.format}</div>
          )}
          {aideSaisie?.légende && <div className="m-0 italic">{aideSaisie.légende}</div>}
          <div className="flex flex-wrap items-center gap-2">
            <span>Caractères interdits :</span>
            {['?', '*', ':', ';', '{', '}', '\\'].map((char) => (
              <code key={char}>{char}</code>
            ))}
          </div>
        </>
      }
      state={validationErrors[name] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors[name]}
      nativeInputProps={{
        name,
        required: true,
        defaultValue,
        'aria-required': true,
        placeholder: aideSaisie?.format
          ? `Exemple: ${aideSaisie.format}`
          : `Renseigner la référence`,
        pattern: expressionRégulière,
        className: 'uppercase placeholder:capitalize',
      }}
    />
  );
};

const RéférenceDossierTooltip = () => (
  <Tooltip
    kind="click"
    title={
      <>
        Vous pouvez retrouver cette donnée dans le courriel d'accusé de réception de votre demande
        complète de raccordement (
        <Link
          href="https://docs.potentiel.beta.gouv.fr/faq/ou-trouver-la-reference-du-dossier-de-raccordement-de-mon-projet"
          target="_blank"
        >
          voir un exemple d'accusé de réception
        </Link>
        )
      </>
    }
  />
);
