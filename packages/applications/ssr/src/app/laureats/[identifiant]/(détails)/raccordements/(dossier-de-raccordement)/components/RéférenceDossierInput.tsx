import Input from '@codegouvfr/react-dsfr/Input';

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
      label="Référence du dossier de raccordement du projet *"
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
