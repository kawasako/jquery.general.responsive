### !
 * jQuery General responsive v0.1
 * http://terkel.jp/archives/2011/05/jquery-floating-widget-plugin/
 *
 * Copyright (c) 2014 Kohei Kawasaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/MIT
###

$ = jQuery
$window = $ window

### --------------------
  Loading
-------------------- ###

window.is_ie = false;
# javascript
`/*@cc_on
    @if (@_jscript_version == 10)
      window.is_ie = 10;
    @elif (@_jscript_version == 9)
      window.is_ie = 9;
    @elif (@_jscript_version == 5.8)
      window.is_ie = 8;
    @else
      window.is_ie = 7;
    @end
  @*/`

w = window.innerWidth || document.documentElement.clientWidth
if w > 640
  document.documentElement.className = 'device-desktop'
else
  document.documentElement.className = 'device-mobile'
if is_ie < 9
  document.documentElement.className = 'device-desktop'

### --------------------
  WindowSizeWath
-------------------- ###

class WindowSizeWatch

  constructor: (@point)->
    @$window = $ window
    @globalEvent = new NarrowWideEvent('global', @point)
    @init()

  init: ->
    @globalEvent.check(@point)
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

### --------------------
  NarrowWideEvent
-------------------- ###

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

### --------------------
  ResponsiveImage
-------------------- ###

class ResponsiveImage
  dataAttrName: "data-change-content"
  contentsTypes:
    text: "<span>{contents}</span>"
    image: "<img src='{contents}' alt='{alt}'>"

  constructor: (node, @changeEventName, @restoreEventName)->
    @$node = $ node
    @state = 0
    @changeContents = @$node.attr @dataAttrName
    @changeContents = @changeContents.split ":"
    return false unless @contentsTypes[@changeContents[0]]
    @changeContents = @contentsTypes[@changeContents[0]].replace "{contents}", @changeContents[1]
    @alt = @$node.prop "alt" || @$node.text()
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

### --------------------
  Initialize
-------------------- ###

$ ->
  $("[data-change-content]").each ->
    new ResponsiveImage this, "global-wide", "global-narrow"
  new WindowSizeWatch(640)