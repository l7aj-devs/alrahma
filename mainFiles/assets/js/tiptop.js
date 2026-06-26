/*
 * jQuery TipTop v1.0
 * http://gilbitron.github.io/TipTop
 * https://github.com/gilbitron/TipTop
 *
 * Copyright 2013, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

; (function ($, window, document, undefined) {

	var pluginName = 'tipTop',
		defaults = {
			offsetVertical: 10, // Vertical offset
			offsetHorizontal: 10  // Horizontal offset
		};

	function TipTop(element, options) {
		this.el = element;
		this.$el = $(this.el);
		this.options = $.extend({}, defaults, options);

		this.init();
	}

	TipTop.prototype = {

		init: function () {
			var $this = this;

			this.$el.mouseenter(function (e) {
				var title = $(this).attr('title'),
					tooltip = $('<div class="tiptop"></div>').text(title);
				tooltip.appendTo('body');

				var top = $this.$el.offset().top - $this.el.offsetHeight - $this.options.offsetVertical,
					left = $this.$el.offset().left + $this.options.offsetHorizontal - (tooltip.outerWidth() / 2);

				$('.tiptop').css({ 'top': top, 'left': left });

				$(this).data('title', title).removeAttr('title');
			}).mouseleave(function () {
				$('.tiptop').remove();
				$(this).attr('title', $(this).data('title'));
			});
		}

	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new TipTop(this, options));
			}
		});
	};

})(jQuery, window, document);