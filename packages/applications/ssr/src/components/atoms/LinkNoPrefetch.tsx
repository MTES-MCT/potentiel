import NextLink from 'next/link';

type LinkNoPrefetchProps = React.ComponentProps<typeof NextLink>;

// eslint-disable-next-line react/jsx-props-no-spreading
export const Link = (props: LinkNoPrefetchProps) => <NextLink prefetch={false} {...props} />;
