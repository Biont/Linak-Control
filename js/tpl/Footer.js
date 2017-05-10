function anonymous(locals, escapeFn, include, rethrow
/**/) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
        .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = [], __append = __output.push.bind(__output);
  with (locals || {}) {
    ; __append("<footer class=\"page-footer\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col l6 s12\">\n                <h5 class=\"white-text\">Footer Content</h5>\n                <p class=\"grey-text text-lighten-4\">You can use rows and columns here to organize your footer content.</p>\n            </div>\n            <div class=\"col l4 offset-l2 s12\">\n                <h5 class=\"white-text\">Links</h5>\n                <ul>\n                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">Link 1</a></li>\n                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">Link 2</a></li>\n                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">Link 3</a></li>\n                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">Link 4</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class=\"footer-copyright\">\n        <div class=\"container\">\n            © 2017 Moritz Meißelbach\n            <a class=\"grey-text text-lighten-4 right\" href=\"#!\">More Links</a>\n        </div>\n    </div>\n</footer>")
  }
  return __output.join("");

}