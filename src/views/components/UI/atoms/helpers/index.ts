export function isLinkMailTo(href: string | undefined): boolean {
  return (href && href.startsWith('mailto:')) || false
}
