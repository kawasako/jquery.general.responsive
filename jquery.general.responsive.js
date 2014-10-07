// Generated by CoffeeScript 1.6.3
/* !
 * jQuery General responsive v0.1
 * https://github.com/kawasako/jquery.general.responsive
 *
 * Copyright (c) 2014 Kohei Kawasaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/MIT
*/


(function() {
  var $, $window, NarrowWideEvent, POINT, ResponsiveImage, WindowSizeWatch, appVersion, userAgent, w;

  $ = jQuery;

  $window = $(window);

  POINT = 768;

  /*
  Loading
  Pre rendering.
  */


  userAgent = window.navigator.userAgent.toLowerCase();

  appVersion = window.navigator.appVersion.toLowerCase();

  window.is_ie = (function() {
    if (userAgent.indexOf("msie") !== -1) {
      if (appVersion.indexOf("msie 6.") !== -1) {
        return 6;
      } else if (appVersion.indexOf("msie 7.") !== -1) {
        return 7;
      } else if (appVersion.indexOf("msie 8.") !== -1) {
        return 8;
      } else if (appVersion.indexOf("msie 9.") !== -1) {
        return 9;
      } else {
        return 10;
      }
    } else {
      return 999;
    }
  })();

  w = window.innerWidth || document.documentElement.clientWidth;

  if (w > POINT) {
    document.documentElement.className = 'device-desktop';
  } else {
    document.documentElement.className = 'device-mobile';
  }

  if (is_ie < 9) {
    document.documentElement.className = 'device-desktop';
  }

  /*
  WindowSizeWath
  Biding resize event.
  */


  WindowSizeWatch = (function() {
    function WindowSizeWatch(point) {
      this.point = point;
      this.$window = $(window);
      this.globalEvent = new NarrowWideEvent('global', this.point);
      this.init();
    }

    WindowSizeWatch.prototype.init = function() {
      var windowSize,
        _this = this;
      this.globalEvent.check(this.point);
      if (window.is_ie < 9) {
        return false;
      }
      this.$window.resize(function(event) {
        var windowSize;
        windowSize = event.target.innerWidth || document.body.clientWidth;
        return _this.globalEvent.check(windowSize);
      });
      $(window).on({
        'global-wide': function() {
          return document.documentElement.className = 'device-desktop';
        },
        'global-narrow': function() {
          if (!is_ie || is_ie > 8) {
            return document.documentElement.className = 'device-mobile';
          }
        }
      });
      windowSize = window.innerWidth || document.body.clientWidth;
      return this.globalEvent.check(windowSize);
    };

    return WindowSizeWatch;

  })();

  /*
  NarrowWideEvent
  Push window event.
  */


  NarrowWideEvent = (function() {
    function NarrowWideEvent(prefix, point) {
      this.prefix = prefix;
      this.point = point;
      this.$window = $(window);
      this.state = null;
    }

    NarrowWideEvent.prototype.check = function(num) {
      if (this.state === 'narrow') {
        if (this.point < num) {
          this.$window.trigger("" + this.prefix + "-wide");
          return this.state = 'wide';
        }
      } else if (this.state === 'wide') {
        if (this.point >= num) {
          this.$window.trigger("" + this.prefix + "-narrow");
          return this.state = 'narrow';
        }
      } else {
        if (this.point < this.$window.width()) {
          this.$window.trigger("" + this.prefix + "-wide");
          return this.state = 'wide';
        } else {
          this.$window.trigger("" + this.prefix + "-narrow");
          return this.state = 'narrow';
        }
      }
    };

    return NarrowWideEvent;

  })();

  /*
  ResponsiveImage
  Change DOM contents.
  */


  ResponsiveImage = (function() {
    ResponsiveImage.prototype.dataAttrName = "data-change-content";

    ResponsiveImage.prototype.contentsTypes = {
      text: "<span>{contents}</span>",
      image: "<img src='{contents}' alt='{alt}'>"
    };

    function ResponsiveImage(node, changeEventName, restoreEventName) {
      this.changeEventName = changeEventName;
      this.restoreEventName = restoreEventName;
      this.$node = $(node);
      this.state = 0;
      this.changeContents = this.$node.attr(this.dataAttrName);
      this.changeContents = this.changeContents.split(":");
      if (!this.contentsTypes[this.changeContents[0]]) {
        return false;
      }
      this.changeContents = this.contentsTypes[this.changeContents[0]].replace("{contents}", this.changeContents[1]);
      this.alt = this.$node.prop("alt" || this.$node.text());
      if (!this.alt) {
        this.alt = "";
      }
      this.changeContents = this.changeContents.replace("{alt}", this.alt);
      this.$changeContents = $(this.changeContents);
      this.setEvent();
    }

    ResponsiveImage.prototype.setEvent = function() {
      var events,
        _this = this;
      events = {};
      events[this.changeEventName] = function() {
        _this.$node.after(_this.$changeContents);
        _this.$node.remove();
        return _this.state = 1;
      };
      events[this.restoreEventName] = function() {
        if (_this.state > 0) {
          _this.$changeContents.after(_this.$node);
          _this.$changeContents.remove();
          return _this.state = 0;
        }
      };
      return $window.on(events);
    };

    return ResponsiveImage;

  })();

  /*
  Initialize
  */


  $(function() {
    $("[data-change-content]").each(function() {
      return new ResponsiveImage(this, "global-wide", "global-narrow");
    });
    return new WindowSizeWatch(POINT);
  });

}).call(this);
