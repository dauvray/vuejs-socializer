import actionsUsers from './users/actions'
import mutationsUsers from './users/mutations'
import gettersUsers from './users/getters'
import originalState from './users/state'

export const state = originalState()
export const actions = actionsUsers
export const getters = gettersUsers
export const mutations = mutationsUsers
