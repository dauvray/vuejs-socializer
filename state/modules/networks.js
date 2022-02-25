import actionsNetworks from './networks/actions'
import mutationsNetworks from './networks/mutations'
import gettersNetworks from './networks/getters'
import originalState from './networks/state'

export const state = originalState()
export const actions = actionsNetworks
export const getters = gettersNetworks
export const mutations = mutationsNetworks
