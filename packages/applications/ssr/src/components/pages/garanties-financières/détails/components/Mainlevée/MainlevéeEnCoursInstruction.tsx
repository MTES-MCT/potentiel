import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Email } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type MainlevéeEnCoursInstructionProps = {
  instruction: {
    date: Iso8601DateTime;
    par?: Email.RawType;
  };
};

export const MainlevéeEnCoursInstruction: FC<MainlevéeEnCoursInstructionProps> = ({
  instruction,
}) => (
  <div>
    Instruction démarrée le : <FormattedDate className="font-semibold" date={instruction.date} />{' '}
    par <span className="font-semibold">{instruction.par}</span>
  </div>
);
