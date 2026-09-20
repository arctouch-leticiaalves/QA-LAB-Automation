import { Faker, pt_BR, en } from '@faker-js/faker'

const faker = new Faker({ locale: [pt_BR, en] })

export type ProfileData = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export const profileData = {
  valid: (): ProfileData => ({
    fullName: faker.person.fullName(),
    email: 'testing@arctouch.com',
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),
  }),
  forNegativeCase(caseDesc: string): ProfileData {
    const base = profileData.valid()
    switch (caseDesc) {
      case 'an empty full name':
        return { ...base, fullName: '' }
      case 'an empty email':
        return { ...base, email: '' }
      case 'a malformed email':
        return profileData.malformedEmail()
      default:
        throw new Error(`Unknown edit profile negative case: "${caseDesc}"`)
    }
  },
  malformedEmail: (): ProfileData => ({
    ...profileData.valid(),
    email: 'not-an-email',
  }),
}
