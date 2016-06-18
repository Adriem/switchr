class Session

  ### @constructor ###
  constructor: (@name, @windowList = []) ->

  getWindowCount: -> @windowList.length

  getTabCount: ->
    @windowList.reduce ((accum, window) -> accum + window.getTabsCount()), 0

  hasTab: (tab) ->
    @windowList.reduce ((accum, window) -> accum or window.hasTab(tab)), false

  # TODO: needs testing
  checkForChanges: (otherSession) =>
    @getWindowCount() isnt otherSession.getWindowCount() or
        @windowList.reduce ((accum, window) ->
      accum or countWindowAppearances(window, this) isnt
        countWindowAppearances(window, otherSession)
    ), false

  clone: -> new Session(@name, @windowList.map (window) -> window.clone())

  @revive: (objectData) ->
    throw newMissingFieldError('name') if not objectData.name?
    throw newMissingFieldError('windowList') if not objectData.windowList?
    new Session objectData.name, objectData.windowList.map (window) ->
      switchr.Window.revive(window)

newMissingFieldError = (field) ->
  new TypeError "Data does not contain '#{field}'field"

countWindowAppearances = (window, session) ->
  session.windowList.reduce ((accum, _window) ->
    if window.equals(_window) then accum + 1 else accum
  ), 0


window.switcher ?= {}
window.switchr.Session = Session
