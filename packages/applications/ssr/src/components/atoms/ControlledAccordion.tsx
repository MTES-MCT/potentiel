import Accordion from '@codegouvfr/react-dsfr/Accordion';
import { type ReactNode, useState } from 'react';

type ControlledAccordionProps = {
  title: string;
  defaultExpanded: boolean;
  children: NonNullable<ReactNode>;
};

export const ControlledAccordion = ({
  defaultExpanded,
  title: titre,
  children,
}: ControlledAccordionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Accordion label={titre} onExpandedChange={(value) => setExpanded(!value)} expanded={expanded}>
      {children}
    </Accordion>
  );
};
