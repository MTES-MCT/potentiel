import type { FC } from 'react';
import Markdown, { type Components } from 'react-markdown';

import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from './headings';

export type FormattedMarkdownProps = {
  content: string;
};

const components: Components = {
  h1: ({ children }) => <Heading1>{children}</Heading1>,
  h2: ({ children }) => <Heading2>{children}</Heading2>,
  h3: ({ children }) => <Heading3>{children}</Heading3>,
  h4: ({ children }) => <Heading4>{children}</Heading4>,
  h5: ({ children }) => <Heading5>{children}</Heading5>,
  h6: ({ children }) => <Heading6>{children}</Heading6>,
};

export const FormattedMarkdown: FC<FormattedMarkdownProps> = ({ content }) => (
  <Markdown
    allowedElements={['strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
    unwrapDisallowed
    components={components}
  >
    {content}
  </Markdown>
);
