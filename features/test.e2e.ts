describe('Local', () => {
  let page
  beforeAll(async () => {
    page = await global['__BROWSER__'].newPage()
    await page.goto('http://localhost:3001/hello')
  })

  it('should be titled "Google"', async () => {
    await expect(page.content()).resolves.toMatch(
      '<html><head></head><body>Hello, World!</body></html>'
    )
    console.log('done')
  })
})
