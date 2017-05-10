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
    ; __append("<nav>\n    <div class=\"nav-wrapper\">\n        <a href=\"#\" class=\"brand-logo\">This page is under construction</a>\n        <ul id=\"nav-mobile\" class=\"right hide-on-med-and-down\">\n            <li><a href=\"sass.html\">Sass</a></li>\n            <li><a href=\"badges.html\">Components</a></li>\n            <li><a href=\"collapsible.html\">JavaScript</a></li>\n        </ul>\n    </div>\n</nav>")
  }
  return __output.join("");

}