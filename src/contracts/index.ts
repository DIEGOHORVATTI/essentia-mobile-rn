import type {
  ContractRouterClient,
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from '@orpc/contract'

import { conditions, patients } from './routes'

export * from './schemas'
export { COMMON_ERRORS } from './errors'

export const contracts = { patients, conditions }

export type AppRouter = typeof contracts
export type AppClient = ContractRouterClient<typeof contracts>

export type AppInputs = InferContractRouterInputs<typeof contracts>
export type AppOutputs = InferContractRouterOutputs<typeof contracts>
