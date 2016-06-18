describe 'Session repository service', ->

  FAKE_SESSIONS = 2
  FAKE_WINDOWS = 2
  FAKE_TABS = 3

  SessionRepositoryService = null
  LocalStorageKeys = null
  fakeStorage = {}
  dummySessions = null
  sandbox = null

  beforeEach module('switchr')
  beforeEach inject (_LocalStorageKeys_, _SessionRepositoryService_) ->

    SessionRepositoryService = _SessionRepositoryService_
    LocalStorageKeys = _LocalStorageKeys_
    sandbox = sinon.sandbox.create()
    sandbox.stub(localStorage, 'getItem', (key) -> fakeStorage[key])
    sandbox.stub(localStorage, 'setItem', (key, val) -> fakeStorage[key] = val)
    sandbox.stub(localStorage, 'removeItem', (key) -> delete fakeStorage[key])

    dummySessions = (new switchr.Session("Dummy session #{session_idx}",
      new switchr.Window(
        new switchr.Tab(
          "http://dummyurl#{session_idx}#{window_idx}#{tab_idx}.com"
        ) for tab_idx in [1..FAKE_TABS]
      ) for window_idx in [1..FAKE_WINDOWS]
    ) for session_idx in [1..FAKE_SESSIONS])

    fakeStorage[LocalStorageKeys.SESSIONS] = JSON.stringify(dummySessions)

  afterEach -> sandbox.restore()


  describe '#findSessionByName(name)', ->

    it 'should return a promise', ->
      promise = SessionRepositoryService.findSessionByName('Dummy session 1')
      expect(promise).to.be.a('promise')

    it 'should be able to find a session given its name', (done) ->
      SessionRepositoryService.findSessionByName(dummySessions[0].name)
        .then (session) ->
          expect(session).to.eql(dummySessions[0])
          done()
        .catch done

    it 'should throw \'Session not found\' when no session is found', (done) ->
      SessionRepositoryService.findSessionByName('Non existing session')
        .then (session) -> done new Error('Session found')
        .catch (error) ->
          # Since this test is asynchronous, we must explicitly catch all
          # the errors and exceptions and call done with the given errors
          try
            expect(error).to.exist
            expect(error).to.be.a('error')
            expect(error.message).to.equal('Session not found')
            done()
          catch _error
            done(_error)


  describe '#findAllSessions()', ->

    it 'should return a promise', ->
      promise = SessionRepositoryService.findAllSessions('Dummy session 1')
      expect(promise).to.be.a('promise')

    it 'should retrieve all the stored sessions', (done) ->
      SessionRepositoryService.findAllSessions()
        .then (sessionList) ->
          expect(sessionList).to.eql(dummySessions)
          done()
        .catch done


  describe '#insertSession()', ->

    newSession = null
    beforeEach ->
      newSession = new switchr.Session('New dummy session',
        new switchr.Window(
          new switchr.Tab(
            "http://newdummyurl#{window_idx}#{tab_idx}.com"
          ) for tab_idx in [1..FAKE_TABS]
        ) for window_idx in [1..FAKE_WINDOWS]
      )

    it 'should return a promise', ->
      promise = SessionRepositoryService.insertSession(newSession)
      expect(promise).to.be.a('promise')

    it 'should not modify sessions already stored', (done) ->
      SessionRepositoryService.insertSession(newSession)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length + 1)
          expect(session).to.eql(switchr.Session.revive(
            storedSessions.filter((x) -> x.name is session.name)[0]
          )) for session in dummySessions
          done()
        .catch done

    it 'should add a session to the session list', (done) ->
      SessionRepositoryService.insertSession(newSession)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length + 1)
          expect(newSession).to.eql(switchr.Session.revive(
            storedSessions.filter((x) -> x.name is newSession.name)[0]
          ))
          done()
        .catch done

    it 'should throw \'Name already in use\' when a session ' +
        'with the inserted one\'s name already exists', (done) ->
      newSession.name = dummySessions[0].name
      SessionRepositoryService.insertSession(newSession)
        .then (session) -> done new Error('Session was inserted')
        .catch (error) ->
          try
            expect(error).to.exist
            expect(error).to.be.a('error')
            expect(error.message).to.equal('Name already in use')
            done()
          catch _error
            done(_error)

    it 'should return the inserted session', (done) ->
      SessionRepositoryService.insertSession(newSession)
        .then (session) ->
          expect(newSession).to.eql(session)
          done()
        .catch done


  describe '#updateSession()', ->

    originalSession = null
    updatedSession = null
    beforeEach ->
      originalSession = dummySessions[0]
      updatedSession = originalSession.clone()
      updatedSession.windowList.pop()
      window.tabList.pop() for window in updatedSession.windowList

    it 'should return a promise', ->
      promise = SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
      expect(promise).to.be.a('promise')

    it 'should not modify sessions already stored', (done) ->
      updatedSession.name = originalSession.name + ' edited'
      SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length)
          expect(session).to.eql(switchr.Session.revive(
            storedSessions.filter((x) -> x.name is session.name)[0]
          )) for session in dummySessions when session.name isnt originalSession.name
          done()
        .catch done

    it 'should replace original session\'s name with the new one', (done) ->
      updatedSession.name = originalSession.name + ' edited'
      SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length)
          expect(storedSessions.filter(
            (x) -> x.name is originalSession.name
          ).length).to.equal(0)
          expect(switchr.Session.revive storedSessions.filter(
            (x) -> x.name is updatedSession.name
          )[0]).to.eql(updatedSession)
          done()
        .catch done

    it 'should replace original session\'s data with the new one', (done) ->
      SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length)
          expect(switchr.Session.revive storedSessions.filter(
            (x) -> x.name is originalSession.name
          )[0]).to.eql(updatedSession)
          done()
        .catch done

    it 'should throw \'Session does not exist\' when there is no session ' +
        'stored with the given name', (done) ->
      SessionRepositoryService
        .updateSession('Non existing session', updatedSession)
        .then (session) -> done new Error('Session was updated')
        .catch (error) ->
          try
            expect(error).to.exist
            expect(error).to.be.a('error')
            expect(error.message).to.equal('Session does not exist')
            done()
          catch _error
            done(_error)

    it 'should throw \'Name already in use\' when another session ' +
        'with the new name already exists', (done) ->
      updatedSession.name = dummySessions[1].name
      SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
        .then (session) -> done new Error('Session was updated')
        .catch (error) ->
          try
            expect(error).to.exist
            expect(error).to.be.a('error')
            expect(error.message).to.equal('Name already in use')
            done()
          catch _error
            done(_error)

    it 'should return the original session', (done) ->
      SessionRepositoryService
        .updateSession(originalSession.name, updatedSession)
        .then (session) ->
          expect(originalSession).to.eql(session)
          done()
        .catch done


  describe '#removeSession()', ->

    deletedSession = null
    beforeEach -> deletedSession = dummySessions[0]

    it 'should return a promise', ->
      promise = SessionRepositoryService.removeSession(deletedSession)
      expect(promise).to.be.a('promise')

    it 'should not modify sessions already stored', (done) ->
      SessionRepositoryService.removeSession(deletedSession.name)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length - 1)
          expect(session).to.eql(switchr.Session.revive(
            storedSessions.filter((x) -> x.name is session.name)[0]
          )) for session in dummySessions when session.name isnt deletedSession.name
          done()
        .catch done

    it 'should remove the session with the given name from the collection', (done) ->
      SessionRepositoryService.removeSession(deletedSession.name)
        .then (session) ->
          expect(fakeStorage[LocalStorageKeys.SESSIONS]).to.be.a('string')
          storedSessions = JSON.parse(fakeStorage[LocalStorageKeys.SESSIONS])
          expect(storedSessions.length).to.equal(dummySessions.length - 1)
          expect(storedSessions.filter(
            (x) -> x.name is deletedSession.name
          ).length).to.equal(0)
          done()
        .catch done

    it 'should throw \'Session does not exist\' when there is no session ' +
        'stored with the given name', (done) ->
      SessionRepositoryService.removeSession('Non existing session')
        .then (session) -> done new Error('Session was deleted')
        .catch (error) ->
          try
            expect(error).to.exist
            expect(error).to.be.a('error')
            expect(error.message).to.equal('Session does not exist')
            done()
          catch _error
            done(_error)

    it 'should return the deleted session', (done) ->
      SessionRepositoryService.removeSession(deletedSession.name)
        .then (session) ->
          expect(deletedSession).to.eql(session)
          done()
        .catch done
