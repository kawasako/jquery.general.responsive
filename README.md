How to use data-change-content
-------------------------------
    <!-- image to image -->
    <img src="path/mobile-image.jpg" data-change-content="image::path/desktop-image.jpg" alt="">

    <!-- text to image -->
    <span data-change-content="image::path/desktop-image.jpg">mobile-text</span>

    <!-- image to text -->
    <img src="path/mobile-image.jpg" data-change-content="text::desktop-text" alt="">

How to use break point event
-------------------------------
    $(window).on({
      'global-wide': function() {
        // narrow to wide
      },
      'global-narrow': function() {
        // wide to narrow
      },
    });

How to change break point
-------------------------------
Open your jquery.general.responsive.js

    POINT = 768; // => Line 18