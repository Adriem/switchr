describe 'Demo test w/ angular-mocks', ->

  LocalStorageKeys = null
  
  beforeEach module('switchr')
  beforeEach inject (_LocalStorageKeys_) -> LocalStorageKeys = _LocalStorageKeys_

  it 'should always succeed', ->
    expect(LocalStorageKeys.SESSIONS).to.exist
    expect(LocalStorageKeys.ACTIVE_SESSION).to.exist

  it.skip 'should not fail when wrong assertions are skipped', ->
    expect(LocalStorageKeys.SESSIONS).not.to.exist

  it 'will eventually have one more test defined'
