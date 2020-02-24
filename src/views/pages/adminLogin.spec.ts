import { render } from '@testing-library/react'
import { expect } from 'chai'

import adminLogin from './adminLogin'

describe('The administrator login page', () => {
  it('should contain a login and password field', () => {
    const { getByLabelText } = render(adminLogin())
    expect(getByLabelText('Mot de passe')).to.not.be.undefined
    expect(getByLabelText('Courrier électronique')).to.not.be.undefined
  })
})
