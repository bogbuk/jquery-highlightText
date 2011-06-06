/*
* jQuery highlightText plugin 0.1.0
*
* Copyright (c) 2011 Kjel Delaey
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($) {
    $.fn.highlightText = function(text, options) {
        var settings = {
            cssClass: 'mark',
            ignoreCase: true
        };

        var methods = {
            innerHighlight: function(node, text) {
                var skip = 0;

                if(3 == node.nodeType) {
                    var pattern = methods._ignoreCase() ? text.toUpperCase() : text;
                    var nodeData = methods._ignoreCase() ? node.data.toUpperCase() : node.data;
                    var patternIndex = nodeData.indexOf(pattern);

                    if (patternIndex >= 0) {
                        methods._replaceNodeContent(node, text, patternIndex);
                        skip = 1;
                    }
                }
                else if(methods._possibleTextNode(node)) {
                    methods._lookupTextNodes(node, text);
                }

                return skip;
            },

            _ignoreCase: function() {
                return settings && settings.ignoreCase;
            },

            _possibleTextNode: function(node) {
                return (1 == node.nodeType && node.childNodes && !/(script|style)/i.test(node.tagName));
            },

            _lookupTextNodes: function(node, text) {
                for (var i=0; i<node.childNodes.length; i++) {
                    i += methods.innerHighlight(node.childNodes[i], text);
                }
            },

            _replaceNodeContent: function(node, text, patternIndex) {
                var spanNode = document.createElement('span');
                var startOfText = node.splitText(patternIndex);
                var endOfText = startOfText.splitText(text.length);
                var matchedText = startOfText.cloneNode(true);

                spanNode.className = settings.cssClass;
                spanNode.appendChild(matchedText);
                startOfText.parentNode.replaceChild(spanNode, startOfText);
            }
        };

        return this.each(function() {
            if(options) {
                $.extend(settings, options);
            }

            methods.innerHighlight(this, text);
        });
    }
})(jQuery);
