### !
 * jQuery General responsive v0.1
 * https://github.com/kawasako/jquery.general.responsive
 *
 * Copyright (c) 2014 Kohei Kawasaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/MIT
###

$ = jQuery
$window = $ window
POINT = 768

###
Loading
Pre rendering.
###

userAgent = window.navigator.userAgent.toLowerCase()
appVersion = window.navigator.appVersion.toLowerCase()
window.is_ie = do ->
  unless userAgent.indexOf("msie") is -1
    unless appVersion.indexOf("msie 6.") is -1
      return 6
    else unless appVersion.indexOf("msie 7.") is -1
      return 7
    else unless appVersion.indexOf("msie 8.") is -1
      return 8
    else unless appVersion.indexOf("msie 9.") is -1
      return 9
    else
      return 10
  else
    return 999

w = window.innerWidth || document.documentElement.clientWidth
if w > POINT
  document.documentElement.className = 'device-desktop'
else
  document.documentElement.className = 'device-mobile'
if is_ie < 9
  document.documentElement.className = 'device-desktop'

###
WindowSizeWath
Biding resize event.
###

class WindowSizeWatch

  constructor: (@point)->
    @$window = $ window
    @globalEvent = new NarrowWideEvent('global', @point)
    @init()

  init: ->
    @globalEvent.check(@point)
    return false if window.is_ie < 9
    @$window.resize (event)=>
      windowSize = event.target.innerWidth || document.body.clientWidth
      @globalEvent.check(windowSize)

    # set event
    $(window).on
      'global-wide': ->
        document.documentElement.className = 'device-desktop'
      'global-narrow': ->
        if !is_ie || is_ie > 8
          document.documentElement.className = 'device-mobile'

    windowSize = event.target.innerWidth || document.body.clientWidth
    @globalEvent.check(windowSize)

###
NarrowWideEvent
Push window event.
###

class NarrowWideEvent

  constructor: (@prefix, @point)->
    @$window = $ window
    @state = null

  check: (num)->
    if @state == 'narrow'
      if @point < num
        @$window.trigger("#{@prefix}-wide")
        @state = 'wide'
    else if @state == 'wide'
      if @point >= num
        @$window.trigger("#{@prefix}-narrow")
        @state = 'narrow'
    else
      if @point < @$window.width()
        @$window.trigger("#{@prefix}-wide")
        @state = 'wide'
      else
        @$window.trigger("#{@prefix}-narrow")
        @state = 'narrow'

###
ResponsiveImage
Change DOM contents.
###

class ResponsiveImage
  dataAttrName: "data-change-content"
  contentsTypes:
    text: "<span>{contents}</span>"
    image: "<img src='{contents}' alt='{alt}'>"

  constructor: (node, @changeEventName, @restoreEventName)->
    @$node = $ node
    @state = 0
    @changeContents = @$node.attr @dataAttrName
    @changeContents = @changeContents.split "::"
    return false unless @contentsTypes[@changeContents[0]]
    @changeContents = @contentsTypes[@changeContents[0]].replace "{contents}", @changeContents[1]
    @alt = if @$node.prop "alt" then @$node.prop "alt" else @$node.text()
    @alt = "" unless @alt
    @changeContents = @changeContents.replace "{alt}", @alt
    @$changeContents = $ @changeContents
    @setEvent()

  setEvent: ->
    events = {}
    events[@changeEventName] = =>
      @$node.after @$changeContents
      @$node.remove()
      @state = 1
    events[@restoreEventName] = =>
      if @state > 0
        @$changeContents.after @$node
        @$changeContents.remove()
        @state = 0
    $window.on events

###
Initialize
###

$ ->
  $("[data-change-content]").each ->
    new ResponsiveImage this, "global-wide", "global-narrow"
  new WindowSizeWatch(POINT)