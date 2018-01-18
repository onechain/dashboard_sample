var DataSet = require('vis/lib/DataSet');
var Network = require('vis/lib/network/Network');

module.exports = function (id) {
    var extended = {
        name: 'network',
        title: 'network',
        size: 'large',
        widgetId: id, //needed for dashboard

        hideLink: true,

        init: function (data) {
            Dashboard.Utils.emit('widget|init|' + this.name);

            if (data) {
                this.setData(data);
            }

            this.shell = Dashboard.TEMPLATES.widget({
                name: this.name,
                title: this.title,
                size: this.size,
                hideLink: this.hideLink,
                hideRefresh: this.hideRefresh,
                customButtons: this.customButtons,
                details: true
            });

            this.initialized = true;

            Dashboard.Utils.emit('widget|ready|' + this.name);

            this.ready();

            Dashboard.Utils.emit('widget|render|' + this.name);

            this.subscribe();
        },


        render: function () {
            Dashboard.render.widget(this.name, this.shell.tpl);
            this.fetch();

            var nodes = new DataSet([
                {id: 1, label: 'Node 1'},
                {id: 2, label: 'Node 2'},
                {id: 3, label: 'Node 3'},
                {id: 4, label: 'Node 4'},
                {id: 5, label: 'Node 5'}
            ]);

            // create an array with edges
            var edges = new DataSet([
                {from: 1, to: 3},
                {from: 1, to: 2},
                {from: 2, to: 4},
                {from: 2, to: 5}
            ]);

            // create a network
            var container = document.getElementById('widget-' + this.shell.id);

            // provide the data in the vis format
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {};

            // initialize your network!
            var network = new Network(container, data, options);


            this.postRender();
            $(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
        },
    };


    var widget = _.extend({}, widgetRoot, extended);

    // register presence with screen manager
    Dashboard.addWidget(widget);
};
