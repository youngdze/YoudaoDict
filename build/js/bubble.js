/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(3);

	var _Youdao = __webpack_require__(7);

	var _Youdao2 = _interopRequireDefault(_Youdao);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bubble = (function () {
	  function Bubble() {
	    _classCallCheck(this, Bubble);
	  }

	  _createClass(Bubble, null, [{
	    key: 'renderBubble',
	    value: function renderBubble(rendered) {
	      if (document.querySelector('#y-bubble')) {
	        var unnecessaryBubble = document.querySelector('#y-bubble');
	        unnecessaryBubble.parentNode.removeChild(unnecessaryBubble);
	      }

	      var selection = window.getSelection();
	      var range = selection.getRangeAt(0);
	      var rect = range.getBoundingClientRect();
	      var bubbleLeft = undefined,
	          bubbleTop = undefined,
	          arrowRelativeLeft = undefined;

	      var dummy = document.createElement('DIV');
	      dummy.innerHTML = rendered.trim();
	      var dummyChild = dummy.childNodes;
	      document.body.appendChild(dummyChild[0]);

	      var bubble = document.querySelector('#y-bubble');

	      bubbleLeft = rect.left + rect.width / 2 - bubble.offsetWidth / 2;

	      if (bubbleLeft < 5) {
	        bubbleLeft = 5;
	        arrowRelativeLeft = rect.left + rect.width / 2 - 15;
	      } else if (bubbleLeft + bubble.offsetWidth > document.body.offsetWidth + 5) {
	        bubbleLeft = document.body.offsetWidth - bubble.offsetWidth - 5;
	        arrowRelativeLeft = rect.left - bubbleLeft - 10 + rect.width / 2;
	      } else {
	        arrowRelativeLeft = bubble.offsetWidth / 2 - 10;
	      }

	      if (rect.top < bubble.offsetHeight) {
	        bubbleTop = rect.top + window.scrollY + rect.height + 8;

	        var bubbleArrow = document.querySelector('#y-arrow');
	        bubbleArrow.style.borderBottom = '10px solid rgba(13, 13, 13, .8)';
	        bubbleArrow.style.borderTop = 0;
	        bubbleArrow.style.top = '-8px';
	        bubbleArrow.style.left = arrowRelativeLeft + 'px';
	      } else {
	        bubbleTop = rect.top + window.scrollY - bubble.offsetHeight - 10;

	        var bubbleArrow = document.querySelector('#y-arrow');
	        bubbleArrow.style.borderBottom = 0;
	        bubbleArrow.style.borderTop = '10px solid rgba(13, 13, 13, .8)';
	        bubbleArrow.style.top = bubble.offsetHeight + 'px';
	        bubbleArrow.style.left = arrowRelativeLeft + 'px';
	      }

	      bubble.style.left = bubbleLeft + 'px';
	      bubble.style.top = bubbleTop + 'px';

	      document.addEventListener('click', function (ev) {
	        if (bubble.parentNode) {
	          bubble.parentNode.removeChild(bubble);
	        }
	      });
	      bubble.addEventListener('click', function (ev) {
	        ev.stopPropagation();
	      });
	    }
	  }, {
	    key: 'enableDblclick',
	    value: function enableDblclick() {
	      document.addEventListener('dblclick', function (ev) {
	        var from = 'YoungdzeBlog';
	        var resType = 'json';
	        var query = window.getSelection().toString().trim();
	        var youdaoKey = 498418215;

	        if (Object.is(query.toString().trim(), '')) return;

	        Bubble.renderBubble(__webpack_require__(9)({ loading: true }));
	        var youdao = new _Youdao2.default(from, youdaoKey, resType, query);
	        youdao.getContent().then(function (data) {
	          data.loading = false;
	          Bubble.renderBubble(__webpack_require__(9)(data));
	          Bubble.addToWordBook();
	        }).catch(function (err) {
	          Bubble.renderBubble(__webpack_require__(9)({
	            explains: err
	          }));
	        });
	      });
	    }
	  }, {
	    key: 'enableKeydown',
	    value: function enableKeydown() {
	      var map = [];
	      document.addEventListener('keydown', function (ev) {
	        return map.push(ev.keyCode);
	      });
	      document.addEventListener('keyup', function (ev) {
	        if (Object.is(map.length, 1) && Object.is(map[0], 17)) {
	          var from = 'YoungdzeBlog';
	          var resType = 'json';
	          var query = window.getSelection().toString().trim();
	          var youdaoKey = 498418215;

	          if (Object.is(query.toString().trim(), '')) return;

	          Bubble.renderBubble(__webpack_require__(9)({ loading: true }));
	          var youdao = new _Youdao2.default(from, youdaoKey, resType, query);
	          youdao.getContent().then(function (data) {
	            data.loading = false;
	            Bubble.renderBubble(__webpack_require__(9)(data));
	          }).catch(function (err) {
	            Bubble.renderBubble(__webpack_require__(9)({ explains: err }));
	          });
	        }
	        map = [];
	      });
	    }
	  }, {
	    key: 'addToWordBook',
	    value: function addToWordBook() {
	      var addToWordBookSuccessText = '添加成功';
	      var addToWordBookAction = document.querySelector('#addToWordBookAction');
	      if (addToWordBookAction) {
	        addToWordBookAction.addEventListener('click', function (ev) {
	          var word = ev.target.getAttribute('data-word');
	          _Youdao2.default.addToWordBook(word).then(function (res) {
	            ev.target.textContent = addToWordBookSuccessText;
	          }).catch(function (err) {});
	        });
	      }
	    }
	  }, {
	    key: 'onLoad',
	    value: function onLoad() {
	      chrome.storage.sync.get(function (items) {
	        if (items.dblclick) Bubble.enableDblclick();
	        if (items.ctrl) Bubble.enableKeydown();
	      });
	    }
	  }]);

	  return Bubble;
	})();

	exports.default = Bubble;

	Bubble.onLoad();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./bubble.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./bubble.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".y-bubble {\n  position: absolute;\n  z-index: 9999;\n  margin: 0;\n  padding: 10px;\n  min-width: 300px;\n  max-width: 500px;\n  border-radius: 5px;\n  background-color: rgba(13, 13, 13, 0.8);\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);\n  color: #fff !important;\n  text-align: left;\n  font-weight: 300;\n  font-size: 16px;\n  font-family: \"Roboto\", 'Helvetica', sans-serif;\n  line-height: 1.5; }\n  .y-bubble p {\n    margin: 2px 0;\n    color: #fff !important;\n    line-height: 20px; }\n  .y-bubble .y-bubble-word {\n    color: #f60; }\n  .y-bubble .y-arrow {\n    position: absolute;\n    width: 0;\n    height: 0;\n    border-right: 10px solid transparent;\n    border-left: 10px solid transparent; }\n  .y-bubble .y-bubble-explains {\n    margin: 10px 0; }\n  .y-bubble .y-clearfix:before, .y-bubble .y-clearfix:after {\n    display: table;\n    content: ''; }\n  .y-bubble .y-clearfix:after {\n    clear: both; }\n  .y-bubble .y-bubble-more {\n    margin-top: 10px; }\n    .y-bubble .y-bubble-more .y-pull-left {\n      float: left; }\n    .y-bubble .y-bubble-more .y-pull-right {\n      float: right; }\n    .y-bubble .y-bubble-more a {\n      color: #ffffff !important;\n      text-decoration: none !important; }\n      .y-bubble .y-bubble-more a:hover {\n        text-decoration: underline !important; }\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Youdao = (function () {
	  function Youdao(from, key, resType, query) {
	    _classCallCheck(this, Youdao);

	    var _ref = [from, key, resType, query];
	    this.from = _ref[0];
	    this.key = _ref[1];
	    this.resType = _ref[2];
	    this.query = _ref[3];

	    this.requestUrl = 'https://fanyi.youdao.com/openapi.do?keyfrom=' + this.from + '&key=' + this.key + '&type=data&doctype=' + this.resType + '&version=1.1&q=';
	  }

	  _createClass(Youdao, [{
	    key: 'parseJsonContent',
	    value: function parseJsonContent(res) {
	      var word = undefined,
	          explains = undefined,
	          pronoun = undefined,
	          wav = undefined,
	          relate = [],
	          more = undefined;

	      word = res.query;
	      if (!res) {
	        explains = 'Nothing found.';
	      } else if (Object.is(typeof res === 'undefined' ? 'undefined' : _typeof(res), 'string')) {
	        explains = res.toString();
	      } else if (!res.basic) {
	        explains = res.translation[0];
	      } else {
	        explains = res.basic.explains;
	        res.basic.phonetic && (pronoun = res.basic.phonetic.split(';')[0]);
	        !Youdao.isChinese(word) && (wav = 'http://dict.youdao.com/dictvoice?audio=' + word + '&type=2');
	        res.web && (relate = res.web);
	      }
	      more = 'http://dict.youdao.com/search?q=' + res.query;

	      return {
	        word: word,
	        wav: wav,
	        explains: explains,
	        pronoun: pronoun,
	        relate: relate,
	        more: more
	      };
	    }
	  }, {
	    key: 'parseXmlContent',
	    value: function parseXmlContent(res) {
	      var word = undefined,
	          explains = undefined,
	          pronoun = undefined,
	          wav = undefined,
	          relate = [],
	          more = undefined;

	      word = res.querySelector('query').textContent;
	      if (!res) {
	        explains = 'Nothing found.';
	      } else if (Object.is(typeof res === 'undefined' ? 'undefined' : _typeof(res), 'string')) {
	        explains = res.toString();
	      } else if (!res.querySelectorAll('basic').length) {
	        explains = res.querySelector('translation').querySelector('paragraph').textContent;
	      } else {
	        var explainsNode = res.querySelector('basic').querySelector('explains').querySelectorAll('ex');
	        explains = explainsNode.map(function (v) {
	          return v.textContent;
	        });
	        pronoun = res.querySelector('basic').querySelector('phonetic').textContent || undefined;
	        !Youdao.isChinese(word) && (wav = 'http://dict.youdao.com/dictvoice?audio=' + word + '&type=2');

	        var relates = res.querySelector('web').querySelector('explain');
	        if (relates.length) {
	          relate = relates.map(function (v) {
	            var dummy = {};
	            dummy.key = v.querySelector('key').textContent;
	            dummy.relate = [].concat(_toConsumableArray(v.querySelector('value'))).map(function (v) {
	              return val.textContent;
	            });
	            return dummy;
	          });
	        }
	      }
	      more = res.querySelector('query')[0].textContent;

	      return {
	        word: word,
	        wav: wav,
	        pronoun: pronoun,
	        explains: explains,
	        relate: relate,
	        more: more
	      };
	    }
	  }, {
	    key: 'getContent',
	    value: function getContent() {
	      var _this2 = this;

	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        __webpack_require__(8)(_this2.requestUrl + encodeURIComponent(_this2.query)).then(function (res) {
	          if (res.ok) {
	            // TODO judge res type
	            res.json().then(function (data) {
	              var result = _this.parseJsonContent(data);
	              resolve(result);
	            });
	          } else {
	            reject('Search failed');
	          }
	        }, function (err) {
	          reject('Search failed');
	        });
	      });
	    }
	  }], [{
	    key: 'isChinese',
	    value: function isChinese(query) {
	      var re = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
	      return re.test(query);
	    }
	  }, {
	    key: 'addToWordBook',
	    value: function addToWordBook(word) {
	      var wordBookLoginUrl = 'http://account.youdao.com/login?service=dict&back_url=http://dict.youdao.com/wordbook/wordlist%3Fkeyfrom%3Dnull';
	      var addToWordBookApi = 'http://dict.youdao.com/wordbook/ajax?action=addword&q=';
	      var wordBookDomain = 'dict.youdao.com';
	      // I think the api is maked by an intern: adddone => addone
	      var noUser = 'nouser';
	      var addOne = 'adddone';

	      var headers = new Headers();
	      if (chrome && chrome.cookies) {
	        chrome.cookies.getAll({}, function (cookies) {
	          cookies.forEach(function (cookie) {
	            if (Object.is(cookie.domain, wordBookDomain)) {
	              headers.append('Cookie', cookie.name + '=' + cookie.value);
	            }
	          });
	        });
	      }

	      return new Promise(function (resolve, reject) {
	        __webpack_require__(8)('' + addToWordBookApi + word, {
	          method: 'GET',
	          headers: headers,
	          mode: 'cors',
	          cache: 'default'
	        }).then(function (res) {
	          if (res.ok) {
	            res.json().then(function (data) {
	              if (Object.is(data.message, noUser)) {
	                if (chrome && chrome.tabs) {
	                  chrome.tabs.create({ url: wordBookLoginUrl });
	                } else {
	                  window.open(wordBookLoginUrl, '_blank');
	                }
	                reject();
	              } else if (Object.is(data.message, addOne)) {
	                resolve();
	              }
	            });
	          } else {
	            reject();
	          }
	        }, function (err) {
	          reject(err);
	        });
	      });
	    }
	  }]);

	  return Youdao;
	})();

	exports.default = Youdao;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	function normalizeName(name) {
	    if (typeof name !== 'string') {
	        name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	        throw new TypeError('Invalid character in header field name');
	    }
	    return name.toLowerCase();
	}

	function normalizeValue(value) {
	    if (typeof value !== 'string') {
	        value = value.toString();
	    }
	    return value;
	}

	function Headers(headers) {
	    this.map = {};

	    if (headers instanceof Headers) {
	        headers.forEach(function (value, name) {
	            this.append(name, value);
	        }, this);
	    } else if (headers) {
	        Object.getOwnPropertyNames(headers).forEach(function (name) {
	            this.append(name, headers[name]);
	        }, this);
	    }
	}

	Headers.prototype.append = function (name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var list = this.map[name];
	    if (!list) {
	        list = [];
	        this.map[name] = list;
	    }
	    list.push(value);
	};

	Headers.prototype['delete'] = function (name) {
	    delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function (name) {
	    var values = this.map[normalizeName(name)];
	    return values ? values[0] : null;
	};

	Headers.prototype.getAll = function (name) {
	    return this.map[normalizeName(name)] || [];
	};

	Headers.prototype.has = function (name) {
	    return this.map.hasOwnProperty(normalizeName(name));
	};

	Headers.prototype.set = function (name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)];
	};

	Headers.prototype.forEach = function (callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function (name) {
	        this.map[name].forEach(function (value) {
	            callback.call(thisArg, value, name, this);
	        }, this);
	    }, this);
	};

	function consumed(body) {
	    if (body.bodyUsed) {
	        return Promise.reject(new TypeError('Already read'));
	    }
	    body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	    return new Promise(function (resolve, reject) {
	        reader.onload = function () {
	            resolve(reader.result);
	        };
	        reader.onerror = function () {
	            reject(reader.error);
	        };
	    });
	}

	function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    reader.readAsArrayBuffer(blob);
	    return fileReaderReady(reader);
	}

	function readBlobAsText(blob) {
	    var reader = new FileReader();
	    reader.readAsText(blob);
	    return fileReaderReady(reader);
	}

	var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function () {
	        try {
	            new Blob();
	            return true;
	        } catch (e) {
	            return false;
	        }
	    })(),
	    formData: 'FormData' in self
	};

	function Body() {
	    this.bodyUsed = false;

	    this._initBody = function (body) {
	        this._bodyInit = body;
	        if (typeof body === 'string') {
	            this._bodyText = body;
	        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	            this._bodyBlob = body;
	        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	            this._bodyFormData = body;
	        } else if (!body) {
	            this._bodyText = '';
	        } else {
	            throw new Error('unsupported BodyInit type');
	        }
	    };

	    if (support.blob) {
	        this.blob = function () {
	            var rejected = consumed(this);
	            if (rejected) {
	                return rejected;
	            }

	            if (this._bodyBlob) {
	                return Promise.resolve(this._bodyBlob);
	            } else if (this._bodyFormData) {
	                throw new Error('could not read FormData body as blob');
	            } else {
	                return Promise.resolve(new Blob([this._bodyText]));
	            }
	        };

	        this.arrayBuffer = function () {
	            return this.blob().then(readBlobAsArrayBuffer);
	        };

	        this.text = function () {
	            var rejected = consumed(this);
	            if (rejected) {
	                return rejected;
	            }

	            if (this._bodyBlob) {
	                return readBlobAsText(this._bodyBlob);
	            } else if (this._bodyFormData) {
	                throw new Error('could not read FormData body as text');
	            } else {
	                return Promise.resolve(this._bodyText);
	            }
	        };
	    } else {
	        this.text = function () {
	            var rejected = consumed(this);
	            return rejected ? rejected : Promise.resolve(this._bodyText);
	        };
	    }

	    if (support.formData) {
	        this.formData = function () {
	            return this.text().then(decode);
	        };
	    }

	    this.json = function () {
	        return this.text().then(JSON.parse);
	    };

	    return this;
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	}

	function Request(url, options) {
	    options = options || {};
	    this.url = url;

	    this.credentials = options.credentials || 'omit';
	    this.headers = new Headers(options.headers);
	    this.method = normalizeMethod(options.method || 'GET');
	    this.mode = options.mode || null;
	    this.referrer = null;

	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	        throw new TypeError('Body not allowed for GET or HEAD requests');
	    }
	    this._initBody(options.body);
	}

	function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function (bytes) {
	        if (bytes) {
	            var split = bytes.split('=');
	            var name = split.shift().replace(/\+/g, ' ');
	            var value = split.join('=').replace(/\+/g, ' ');
	            form.append(decodeURIComponent(name), decodeURIComponent(value));
	        }
	    });
	    return form;
	}

	function headers(xhr) {
	    var head = new Headers();
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
	    pairs.forEach(function (header) {
	        var split = header.trim().split(':');
	        var key = split.shift().trim();
	        var value = split.join(':').trim();
	        head.append(key, value);
	    });
	    return head;
	}

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
	    if (!options) {
	        options = {};
	    }

	    this._initBody(bodyInit);
	    this.type = 'default';
	    this.url = null;
	    this.status = options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = options.statusText;
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
	    this.url = options.url || '';
	}

	Body.call(Response.prototype);

	self.Headers = Headers;
	self.Request = Request;
	self.Response = Response;

	self.fetch = function (input, init) {
	    // TODO: Request constructor should accept input, init
	    var request;
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input;
	    } else {
	        request = new Request(input, init);
	    }

	    return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();

	        function responseURL() {
	            if ('responseURL' in xhr) {
	                return xhr.responseURL;
	            }

	            // Avoid security warnings on getResponseHeader when not allowed by CORS
	            if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	                return xhr.getResponseHeader('X-Request-URL');
	            }

	            return;
	        }

	        xhr.onload = function () {
	            var status = xhr.status === 1223 ? 204 : xhr.status;
	            if (status < 100 || status > 599) {
	                reject(new TypeError('Network request failed'));
	                return;
	            }
	            var options = {
	                status: status,
	                statusText: xhr.statusText,
	                headers: headers(xhr),
	                url: responseURL()
	            };
	            var body = 'response' in xhr ? xhr.response : xhr.responseText;
	            resolve(new Response(body, options));
	        };

	        xhr.onerror = function () {
	            reject(new TypeError('Network request failed'));
	        };

	        xhr.open(request.method, request.url, true);

	        if (request.credentials === 'include') {
	            xhr.withCredentials = true;
	        }

	        if ('responseType' in xhr && support.blob) {
	            xhr.responseType = 'blob';
	        }

	        request.headers.forEach(function (value, name) {
	            xhr.setRequestHeader(name, value);
	        });

	        xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    });
	};
	self.fetch.polyfill = true;

	module.exports = self.fetch;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(10);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (Array, explains, loading, more, pronoun, relate, undefined, wav, word) {
	buf.push("<div id=\"y-bubble\" style=\"left: -999px; top: -999px;\" class=\"y-bubble\"><div id=\"y-arrow\" class=\"y-arrow\"></div>");
	if ( loading)
	{
	buf.push("<div class=\"y-searching\">Searching...</div>");
	}
	else
	{
	buf.push("<div class=\"y-bubble-main\"><div class=\"y-bubble-query\">");
	if ( word)
	{
	buf.push("<b class=\"y-bubble-word\">" + (jade.escape((jade_interp = word) == null ? '' : jade_interp)) + "</b>");
	}
	if ( pronoun)
	{
	buf.push("<i>&nbsp;&nbsp;/" + (jade.escape((jade_interp = pronoun) == null ? '' : jade_interp)) + "/&nbsp;&nbsp;");
	if ( wav)
	{
	buf.push("<a id=\"y-bubble-wav\" href=\"javascript:;\"" + (jade.attr("onclick", 'document.querySelector("#y-audio").src="' + (wav) + '";document.querySelector("#y-audio").play();', true, true)) + "><svg id=\"Capa_1\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"1em\" height=\"1em\" viewbox=\"0 0 465.256 465.256\" style=\"enable-background:new 0 0 465.256 465.256; fill: #ffffff; vertical-align: middle;\" xml:space=\"preserve\"><g><g><path d=\"M87.742,204.879c-8.668,0-15.701,7.035-15.701,15.701c0,83.252,63.68,151.883,144.886,159.802v53.471h-86.91c-8.666,0-15.701,7.033-15.701,15.701c0,8.664,7.035,15.701,15.701,15.701h102.614h102.617c8.659,0,15.701-7.037,15.701-15.701c0-8.668-7.042-15.701-15.701-15.701h-86.918v-53.471c81.211-7.919,144.889-76.55,144.889-159.802c0-8.666-7.029-15.701-15.701-15.701c-8.664,0-15.701,7.035-15.701,15.701c0,71.23-57.955,129.189-129.185,129.189c-71.236,0-129.185-57.959-129.185-129.189C103.443,211.915,96.416,204.879,87.742,204.879z\"></path><path d=\"M222.014,326.098h22.626c46.014,0,83.311-37.297,83.311-83.306H138.704C138.704,288.801,176.001,326.098,222.014,326.098z\"></path><path d=\"M245.125,0h-22.632c-46.013,0-83.31,37.297-83.31,83.31h189.253C328.436,37.297,291.13,0,245.125,0z\"></path><rect x=\"139.183\" y=\"99.851\" width=\"188.286\" height=\"31.4\"></rect><rect x=\"139.864\" y=\"146.662\" width=\"188.287\" height=\"31.4\"></rect><rect x=\"138.485\" y=\"195.067\" width=\"188.279\" height=\"31.4\"></rect></g></g></svg></a><audio id=\"y-audio\" style=\"display: none;\" src=\"\"></audio>");
	}
	buf.push("</i>");
	}
	buf.push("</div><div class=\"y-bubble-explains\">");
	if ( explains)
	{
	if ( Array.isArray(explains))
	{
	// iterate explains
	;(function(){
	  var $$obj = explains;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var explain = $$obj[$index];

	buf.push("<p>" + (jade.escape((jade_interp = explain) == null ? '' : jade_interp)) + "</p>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var explain = $$obj[$index];

	buf.push("<p>" + (jade.escape((jade_interp = explain) == null ? '' : jade_interp)) + "</p>");
	    }

	  }
	}).call(this);

	}
	else
	{
	buf.push("<p>" + (jade.escape((jade_interp = explains) == null ? '' : jade_interp)) + "</p>");
	}
	}
	buf.push("</div><div class=\"y-bubble-relate\">");
	if ( relate)
	{
	// iterate relate
	;(function(){
	  var $$obj = relate;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var r = $$obj[$index];

	buf.push("<p>" + (jade.escape((jade_interp = r.key) == null ? '' : jade_interp)) + ":&nbsp;");
	if ( r.value)
	{
	buf.push("" + (jade.escape((jade_interp = r.value) == null ? '' : jade_interp)) + "");
	}
	buf.push("</p>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var r = $$obj[$index];

	buf.push("<p>" + (jade.escape((jade_interp = r.key) == null ? '' : jade_interp)) + ":&nbsp;");
	if ( r.value)
	{
	buf.push("" + (jade.escape((jade_interp = r.value) == null ? '' : jade_interp)) + "");
	}
	buf.push("</p>");
	    }

	  }
	}).call(this);

	}
	buf.push("</div><div class=\"y-bubble-more y-clearfix\">");
	var wordReg = /^\b[a-zA-Z0-9]+\b$/ig;
	if ( wordReg.test(word))
	{
	buf.push("<span class=\"y-pull-left\"><svg id=\"Layer_1\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\".8em\" height=\"1em\" viewbox=\"0 0 512 512\" enable-background=\"new 0 0 512 512\" xml:space=\"preserve\" style=\"fill: #ffffff; vertical-align: text-top; margin: 0 .2em;\"><path d=\"M448,0H64C46.328,0,32,14.313,32,32v448c0,17.688,14.328,32,32,32h288l128-128V32C480,14.313,465.688,0,448,0z M352,466.75V384h82.75L352,466.75z M448,352h-96c-17.688,0-32,14.313-32,32v96H64V32h384V352z M96,112c0-8.844,7.156-16,16-16h288c8.844,0,16,7.156,16,16s-7.156,16-16,16H112C103.156,128,96,120.844,96,112z M96,208c0-8.844,7.156-16,16-16h288c8.844,0,16,7.156,16,16s-7.156,16-16,16H112C103.156,224,96,216.844,96,208z M96,304c0-8.844,7.156-16,16-16h288c8.844,0,16,7.156,16,16s-7.156,16-16,16H112C103.156,320,96,312.844,96,304z\"></path></svg><a id=\"addToWordBookAction\" href=\"javascript:;\"" + (jade.attr("data-word", '' + (word) + '', true, true)) + "> \n添加到有道单词本</a></span>");
	}
	buf.push("<a" + (jade.attr("href", '' + (more) + '', true, true)) + " target=\"_blank\" class=\"y-pull-right\">更多解释 >></a></div></div>");
	}
	buf.push("</div>");}.call(this,"Array" in locals_for_with?locals_for_with.Array:typeof Array!=="undefined"?Array:undefined,"explains" in locals_for_with?locals_for_with.explains:typeof explains!=="undefined"?explains:undefined,"loading" in locals_for_with?locals_for_with.loading:typeof loading!=="undefined"?loading:undefined,"more" in locals_for_with?locals_for_with.more:typeof more!=="undefined"?more:undefined,"pronoun" in locals_for_with?locals_for_with.pronoun:typeof pronoun!=="undefined"?pronoun:undefined,"relate" in locals_for_with?locals_for_with.relate:typeof relate!=="undefined"?relate:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined,"wav" in locals_for_with?locals_for_with.wav:typeof wav!=="undefined"?wav:undefined,"word" in locals_for_with?locals_for_with.word:typeof word!=="undefined"?word:undefined));;return buf.join("");
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(11).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ }
/******/ ]);