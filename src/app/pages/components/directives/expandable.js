// expandable.js
(function () {
	'use strict';

	angular
		.module('LoginsightUiApp')
		.directive('expandable', expandable)

	function expandable() {
		return {
			restrict: 'EA',
			priority: 1,
			scope: {
				btnOpenText: '=',
				btnCloseText: '=',
				charLen: '=',
				isOpen: '=',
				text: '='

			},
			link: function (scope, element, attrs) {
				var that = $(element);
				var isExpand = scope.isOpen || false;

				var _btnOpenText = scope.btnOpenText || '展开';
				var _btnCloseText = scope.btnCloseText || '关闭';
				var summaryCharLen = scope.charLen || 100;

				var content = scope.text || '';
				var hlt_first = content.indexOf('<em class="hlt1">', 0);
				// var prtscroll = $('em.hlt1:eq(0)').parent().parent().parent();
				// console.log(prtscroll, 'more-view----')
				if (hlt_first != -1) {
					if (content.length <= summaryCharLen) {
						that.html(to_trusted(content));
					} else {
						var summary = content.substr(hlt_first - 50, summaryCharLen);

						if (summary.length < summaryCharLen) {
							var _summary = content.substr(0, summaryCharLen)
							that.html(to_trusted(_summary + '...'));
							addbtn();
						} else {
							that.html(to_trusted('...' + summary + '...'));
							addbtn();
						}
					}

				} else {
					if (content.length <= summaryCharLen) {
						that.html(to_trusted(content));
					} else {
						var summary = content.substr(0, summaryCharLen);
						that.html(to_trusted(summary + '...'));
						addbtn();
					}

				}

				function addbtn() {
					var btn = $('<div>' + _btnOpenText + '</div>').click(function (e) {
						var target = $(this).prev();
						if (isExpand) {
							if (hlt_first != -1) {
								if (content.length <= summaryCharLen) {
									that.html(to_trusted(content));
								} else {
									// var summary = content.substr(hlt_first - 50, summaryCharLen);
									if (summary.length < summaryCharLen) {
										// var _summary = content.substr(0, summaryCharLen)
										that.html(to_trusted(_summary + '...'));
									} else {
										that.html(to_trusted('...' + summary + '...'));
									}
								}

							} else {
								if (content.length <= summaryCharLen) {
									that.html(to_trusted(content));
								} else {
									// var summary = content.substr(0, summaryCharLen);
									that.html(to_trusted(summary + '...'));
								}

							}
							// target.html(to_trusted(summary + '...'));
							$(this).html(to_trusted(_btnOpenText));
						} else {
							target.html(to_trusted(content));
							$(this).html(to_trusted((_btnCloseText)));
						}
						isExpand = !isExpand;

					}).insertAfter(that).addClass('toggle-btn');

				}


				function to_trusted(text) {
					// 替换的一些元素
					var replace_string = [{
						'r': /</g,
						's': '&lt;'
					}, {
						'r': />/g,
						's': '&gt;'
					}, {
						'r': /&lt;em/g,
						's': '<em'
					}, {
						'r': /"hlt1"&gt;/g,
						's': '"hlt1">'
					}, {
						'r': /&lt;\/em&gt;/g,
						's': '</em>'
					}, {
						'r': /\n/g,
						's': '<br/>'
					}
						// {'r': /\s/g, 's': '&nbsp;'}
						// {'r': /\t/g, 's': '&nbsp;&nbsp;&nbsp;&nbsp;'}
					];
					if (typeof (text) == 'string') {
						var _result = text;
						replace_string.forEach(function (str) {
							_result = _result.replace(str['r'], str['s']);
						})
						// console.log(_result);
						return _result;
					} else
						return text;

				}
			}
		}
	}

})();
