var Widget = exports;
var WidgetMap = {};
var WidgetCounter = 0;

function guid () {
    var id = 'widget' + (++WidgetCounter);
    WidgetMap[id] = {
        defer: $.Deferred()
    };

    return id;
}

Widget.ready = function (els, cb) {
    if (typeof els === 'string') {
        els = [els];
    }

    var defers = [].reduce.call(els, function (defers, el) {
        var $el = $(el);
        var defer = null;
        if ($el.size() === 1) {
            if (!$el.data('widget-id')) {
                $el.data('widget-id', guid());
            }
            defer = WidgetMap[$el.data('widget-id')].defer.promise();
        } else if ($el.size() >= 1) {
            defer = $.Deferred();
            Widget.ready($el, function () {
                defer.resolve([].slice.call(arguments));
            });
        } else {
            defer = $.Deferred();
            defer.reject(null);
        }
        defers.push(defer);
        return defers;
    }, []);

    $.when.apply($, defers)
        .done(function () {
            cb.apply(window, arguments);
        });
};

Widget.initWidgets = function (widgets) {
    $.each(widgets, function(index, widget){
        Widget.initWidget(widget);
    });
};
Widget.initWidget = function (widget) {
    initWidget(widget);
};

Widget.define = function (def) {
    def = def || {};
    def.events = def.events || {};
    def.init = def.init || function (config) {
        this.config = config;
    };

    function widget (config) {
        var self = $.extend({}, def);
        if ($(config.$el).length && self.events) {
            delegateEvents(config.$el, self.events, self);
        }

        self.init(config);

        return self;
    }
    widget.elength = 0;
    widget.elements = [];
    widget.setEl = function(elements){
        if (!elements) {
            throw new Error('type Error');
        } else if ($.isArray(elements)) {
            widget.elements = widget.elements.concat(elements);
        } else {
            widget.elements.push(elements);
        }
        return widget.elements;
    };
    widget.extend = function (child) {
        child = $.extend({}, def, child);
        child.super_ = $.extend({}, def);
        child.events = $.extend({}, def.events, child.events);

        return Widget.define(child);
    };
    widget.init = function(elements){
        this.setEl(elements);
        initWidget(this);
    };
    widget.define = $.extend({}, def);

    return widget;
};
function initWidget (widget){
    $(function(){
        $.each(widget.elements.slice(widget.elength), function(index, el){
            var $el = $(el);
            if (!$el[0]) {
                console.warn('WIDGET:The element has not found.');
                return ;
            }
            var config = $el.data();
            var roles = {};
            //var widget = config.widget.split('#');
            var id = $el.data('widget-id');
            if (!id) {
                id = guid();
                $el.data('widget-id', id);
            }
            config.$el = $el;
            // 自动收集元素, 例如: config.$btn
            $el.find('[data-role]').each(function () {
                var role = $(this).data('role');

                if (!roles[role]) {
                    roles[role] = [];
                }
                roles[role].push(this);
            });

            $.each(roles, function (key, role) {
                config['$'+key] = $(role);
            });
            var instance = new widget(config);
            widget.elength++;
            WidgetMap[id].instance = instance;
            WidgetMap[id].defer.resolve(instance);
        });
    });
}
function delegateEvents ($root, events, context) {
    $root = $($root);
    $.each(events, function (key, cb) {
        var index = key.indexOf(' ');
        var event = index === -1 ? key : key.substr(0, index);
        var $el   = index === -1 ? '' : key.substr(index, key.length - 1);

        if (!cb) {
            return;
        }

        if (typeof cb === 'function') {
            cb = $.proxy(cb, context);
        } else {
            cb = $.proxy(context[cb], context);
        }
        if ($el) {
            $root.on(event, $el, cb);
        } else {
            $root.on(event, cb);
        }
    });
}
