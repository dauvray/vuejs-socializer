import actionsPosts from './posts/actions'
import mutationsPosts from './posts/mutations'
import gettersPosts from './posts/getters'
import originalState from './posts/state'

export const state = originalState()
export const actions = actionsPosts
export const getters = gettersPosts
export const mutations = mutationsPosts
