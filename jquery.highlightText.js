/*!
* jQuery highlightText Plugin v1.0.0
*
* Copyright 2011, 2013 Kjel Delaey
* Released under the MIT license
* https://raw.github.com/trimentor/jquery-highlightText/master/LICENSE
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
