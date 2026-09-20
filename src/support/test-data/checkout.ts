import { Faker, pt_BR, en } from '@faker-js/faker'

const faker = new Faker({ locale: [pt_BR, en] })

export type CheckoutAddressData = {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export type CheckoutPaymentData = {
  cardNumber: string
  expiry: string
  cvv: string
}

export type CheckoutData = {
  address: CheckoutAddressData
  payment: CheckoutPaymentData
}

const validAddress = (): CheckoutAddressData => ({
  fullName: faker.person.fullName(),
  phone: '5551234567',
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zipCode: faker.location.zipCode({ format: '#####' }),
})

const validPayment = (): CheckoutPaymentData => ({
  cardNumber: '4242424242424242',
  expiry: '12/30',
  cvv: '123',
})

export const checkoutData = {
  /**
   * The app hint requires card 4242 4242 4242 4242; other numbers are declined.
   */
  valid: (): CheckoutData => ({
    address: validAddress(),
    payment: validPayment(),
  }),

  emptyAddress: (): CheckoutAddressData => ({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  }),

  emptyPayment: (): CheckoutPaymentData => ({
    cardNumber: '',
    expiry: '',
    cvv: '',
  }),

  /** Too short to pass card-length validation. */
  invalidShortCard: (): CheckoutPaymentData => ({
    cardNumber: '1234',
    expiry: '12/30',
    cvv: '123',
  }),

  /**
   * Valid-looking non-4242 card — app declines authorization on place order.
   */
  declinedCard: (): CheckoutPaymentData => ({
    cardNumber: '4000000000000002',
    expiry: '12/30',
    cvv: '123',
  }),
}
