import { makeHeading } from './makeHeading';

export const Heading1 = makeHeading({
  defaultAs: 'h1',
  defaultClassName: 'my-5 text-3xl leading-8 font-bold',
});

export const Heading2 = makeHeading({
  defaultAs: 'h2',
  defaultClassName: 'pb-1 text-[26px] leading-7 font-bold',
});

export const Heading3 = makeHeading({
  defaultAs: 'h3',
  defaultClassName: `text-lg leading-6 font-bold`,
});

export const Heading4 = makeHeading({
  defaultAs: 'h4',
  defaultClassName: `text-xl font-bold`,
});

export const Heading5 = makeHeading({
  defaultAs: 'h5',
  defaultClassName: `text-lg font-bold`,
});

export const Heading6 = makeHeading({
  defaultAs: 'h6',
  defaultClassName: `text-base font-bold`,
});
