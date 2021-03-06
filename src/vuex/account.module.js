import _get from 'lodash/get'
import { AccountHelper } from './account.helper'
import { vuexTypes } from './types'
import { Sdk } from '../sdk'

export const state = {
  account: {},
  balancesDetails: []
}

export const mutations = {
  [vuexTypes.SET_ACCOUNT] (state, account) {
    state.account = account
  },

  [vuexTypes.SET_ACCOUNT_BALANCES_DETAILS] (state, balancesDetails) {
    state.balancesDetails = balancesDetails
  }
}

export const actions = {
  async [vuexTypes.LOAD_ACCOUNT] ({ commit }, accountId) {
    const response = await Sdk.horizon.account.get(accountId)
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },

  async [vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS] ({ commit, getters }) {
    const accountId = getters[vuexTypes.accountId]
    const response = await Sdk.horizon.account.getDetails(accountId)

    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, response.data)
  }
}

export const getters = {
  [vuexTypes.account]: state => state.account,
  [vuexTypes.accountId]: state => state.account.id,
  [vuexTypes.accountIsBlocked]: state => state.account.isBlocked,
  [vuexTypes.accountBlockReasons]: state => state.account.blockReasons,
  [vuexTypes.accountType]: state => state.account.accountType,
  [vuexTypes.accountTypeI]: state => state.account.accountTypeI,
  [vuexTypes.accountThresholds]: state => state.account.thresholds,
  [vuexTypes.accountReferrer]: state => state.account.referrer,
  [vuexTypes.accountReferrals]: state => state.account.referrals,
  [vuexTypes.accountPoliciesTypeI]: state => _get(
    state.account, 'policies.accountPoliciesTypeI'
  ),
  [vuexTypes.accountPoliciesTypes]: state => _get(
    state.account, 'policies.accountPoliciesTypes', []
  ), // accountPoliciesTypes can be null if not present, so here we
  // overwrite it for easier interface
  // accountBalances: [], // TODO
  [vuexTypes.accountDepositAddresses]: state =>
    AccountHelper.groupExternalSystemAccounts(
      state.account.externalSystemAccounts
    ),
  [vuexTypes.accountKycBlobId]: state => _get(
    state.account,
    'accountKyc.kycData.blobId'
  )
}

export default {
  state,
  mutations,
  actions,
  getters
}
