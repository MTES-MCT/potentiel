export function isLinkMailTo(href: string | undefined): boolean {
  return (href && href.startsWith('mailto:')) || false
}

export function isLinkPhoneCall(href: string | undefined): boolean {
  return (href && href.startsWith('tel:')) || false
}
