import { FC, ReactNode } from 'react';
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { Icon } from '../atoms/Icon';

type AccordionProps = {
  title: ReactNode;
  content: ReactNode;
};

export const Accordion: FC<AccordionProps> = ({ title, content }) => (
  <MuiAccordion sx={{ boxShadow: 'none', margin: 0 }}>
    <AccordionSummary
      expandIcon={<Icon id="ri-arrow-down-line" />}
      aria-controls="panel1-content"
      id="panel1-header"
      sx={{
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails
      sx={{
        padding: 0,
        margin: 0,
      }}
    >
      {content}
    </AccordionDetails>
  </MuiAccordion>
);
