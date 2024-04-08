import dotenv from 'dotenv'

export function loadENV() {
  dotenv.config({ path: '../../.env.local' })
}
