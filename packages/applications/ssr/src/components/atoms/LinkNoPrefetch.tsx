// eslint-disable-next-line no-restricted-imports
import NextLink from 'next/link';

type LinkNoPrefetchProps = React.ComponentProps<typeof NextLink>;

export const Link = (props: LinkNoPrefetchProps) => <NextLink prefetch={false} {...props} />;
