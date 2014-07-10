// Generated by CoffeeScript 1.6.3
(function() {
  var $, $window, NarrowWideEvent, ResponsiveImage, WindowSizeWatch, w;

  $ = jQuery;

  $window = $(window);

  /* --------------------
    Loading
  --------------------
  */


  window.is_ie = false;

  /*@cc_on
    @if (@_jscript_version == 10)
      window.is_ie = 10;
    @elif (@_jscript_version == 9)
      window.is_ie = 9;
    @elif (@_jscript_version == 5.8)
      window.is_ie = 8;
    @else
      window.is_ie = 7;
    @end
  @*/;

  w = window.innerWidth || document.documentElement.clientWidth;

  if (w > 640) {
    document.documentElement.className = 'device-desktop';
  } else {
    document.documentElement.className = 'device-mobile';
  }

  if (is_ie < 9) {
    document.documentElement.className = 'device-desktop';
  }

  /* --------------------
    WindowSizeWath
  --------------------
  */


  WindowSizeWatch = (function() {
    function WindowSizeWatch(point) {
      this.point = point;
      this.$window = $(window);
      this.globalEvent = new NarrowWideEvent('global', this.point);
      this.init();
    }

    WindowSizeWatch.prototype.init = function() {
      var _this = this;
      this.globalEvent.check(this.point);
      this.$window.resize(function(event) {
        var windowSize;
        windowSize = event.target.innerWidth || document.body.clientWidth;
        return _this.globalEvent.check(windowSize);
      });
      return $(window).on({
        'global-wide': function() {
          return document.documentElement.className = 'device-desktop';
        },
        'global-narrow': function() {
          if (!is_ie || is_ie > 8) {
            return document.documentElement.className = 'device-mobile';
          }
        }
      });
    };

    return WindowSizeWatch;

  })();

  /* --------------------
    NarrowWideEvent
  --------------------
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

  /* --------------------
    ResponsiveImage
  --------------------
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

  /* --------------------
    Initialize
  --------------------
  */


  $(function() {
    $("[data-change-content]").each(function() {
      return new ResponsiveImage(this, "global-wide", "global-narrow");
    });
    return new WindowSizeWatch(640);
  });

}).call(this);
