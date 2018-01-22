
module.exports = function(id) {
	var extended = {
		name: 'chaincodelist',
		title: 'chaincode list',
		size: 'large',
		widgetId: id, //needed for dashboard

		hideLink: true,


		template: _.template('<div class="info-table">' +
			' <table style="width: 100%; table-layout: fixed;" class="table table-striped">' +
			'<thead style="font-weight: bold;">' +
			'<tr><td style="width: 30%;">name</td><td style="width: 10%;">version</td><td style="width: 50%;">path</td><td style="width: 10%;">trans</td></tr>' +
			'</thead>'+
			'<tbody>' +
			'<tr> <td>cb_rog1org2</td> <td>1.0</td><td>github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02</td><td>33</td> </tr>' +
			'</tbody> ' +
			'</table> ' +
			'<div>'),

		init: function(data) {
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


		render: function() {
			Dashboard.render.widget(this.name, this.shell.tpl);
			this.fetch();

			$('#widget-' + this.shell.id).css({
				'height': '240px',
				'margin-bottom': '10px',
				'overflow-x': 'hidden',
				'width': '100%'
			}).html( this.template({
				app: this.data.appName,
				desc: this.data.description,
				numUser: this.data.numUser,
				url: this.data.url
			}) );

			this.postRender();
			$(document).trigger("WidgetInternalEvent", ["widget|rendered|" + this.name]);
		},
	};


	var widget = _.extend({}, widgetRoot, extended);

	// register presence with screen manager
	Dashboard.addWidget(widget);
};
