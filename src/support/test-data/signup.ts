import { Faker, pt_BR, en } from '@faker-js/faker'

const faker = new Faker({ locale: [pt_BR, en] })

export type SignUpData = {
  name: string
  email: string
  phone: string
  password: string
  confirm: string
}

function strongPassword(): string {
  const base = faker.person
    .firstName()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/[^A-Za-z]/gu, '')
  const digits = faker.string.numeric(4)
  return `${base}${digits}!`
}

function uniqueEmail(): string {
  const localPart = faker.internet.username().replace(/[^A-Za-z0-9]/gu, '').slice(0, 8)
  return `qa+${localPart}${Date.now()}@arctouch.com`
}

export const signUpData = {
  valid: (): SignUpData => {
    const password = strongPassword()
    return {
      name: faker.person.fullName(),
      email: uniqueEmail(),
      phone: faker.phone.number(),
      password,
      confirm: password,
    }
  },
  validWithoutPhone: (): SignUpData => ({ ...signUpData.valid(), phone: '' }),
  empty: (): SignUpData => ({ name: '', email: '', phone: '', password: '', confirm: '' }),
  malformedEmail: (): SignUpData => ({ ...signUpData.valid(), email: 'not-an-email' }),
  mismatched: (): SignUpData => { const v = signUpData.valid(); return { ...v, confirm: v.password + 'X' } },
  alreadyRegistered: (): SignUpData => ({ ...signUpData.valid(), email: 'testing@arctouch.com' }),
  
  forNegativeCase(caseDesc: string): { data: SignUpData; acceptTerms: boolean } {
    switch (caseDesc) {
        case 'all fields empty':
            return { data: signUpData.empty(), acceptTerms: false }
        case 'a malformed email':
            return { data: signUpData.malformedEmail(), acceptTerms: true }
        case 'mismatched passwords':
            return { data: signUpData.mismatched(), acceptTerms: true }
        case 'an already registered email':
            return { data: signUpData.alreadyRegistered(), acceptTerms: true }
        case 'valid details but terms unchecked':
            return { data: signUpData.valid(), acceptTerms: false }
        default:
            throw new Error(`Unknown sign up negative case: "${caseDesc}"`)
    }
},
}
