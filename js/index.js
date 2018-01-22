import $ from 'jquery';

import 'bootstrap';
import 'd3';
import 'jquery-ui';
import 'epoch-charting-ie-patched';
import moment from 'moment';

import 'jif-dashboard/dashboard-core'
import 'jif-dashboard/dashboard-util'
import 'jif-dashboard/dashboard-template'

// import this first because it sets a global all the rest of the widgets need
import './widgets/widget-root';

import common from './common';

import './vendor/stomp.min'
import './vendor/client'
import utils from './utils';

window.utils = utils;
window.moment = moment;


window.Tower = {
    ready: false,
    current: null,
    status: {},

    // Tower Control becomes ready only after the first status is received from the server
    isReady: function () {
        Tower.ready = true;

        // let everyone listening in know
        Dashboard.Utils.emit('tower-control|ready|true');

        return true;
    },


    init: function () {
        //set options for the Dashboard
        Dashboard.setOptions({
            'appName': 'onechain fabricexplorer'
        });

        //initialize the Dashboard, set up widget container
        Dashboard.init()

        Dashboard.preregisterWidgets({

            'chaincodelist': require('./widgets/chaincodelist'),
            'network': require('./widgets/network'),
            //'metrix_choc_tx'	: require('./widgets/metrix_choc_tx'),
            'metrix_block_min': require('./widgets/metrix_block_min'),
            'metrix_txn_sec': require('./widgets/metrix_txn_sec'),
            'metrix_txn_min': require('./widgets/metrix_txn_min'),
            'peerlist': require('./widgets/peerlist'),
            'blockview': require('./widgets/blockview'),
            'blocklist': require('./widgets/blocklist'),
            'blockinfo': require('./widgets/blockinfo'),
            'txdetail': require('./widgets/txdetail'),

            /*'lab'				: require('./widgets/lab'),
              'info'			: require('./widgets/info'),
              'form'            : require('./widgets/form'),
              'misc'            : require('./widgets/misc'),
              'date'			: require('./widgets/date'),
              'controls'		: require('./widgets/controls'),
              'weather'			: require('./widgets/weather')*/
        });

        // Reusing socket from cakeshop.js
        Tower.stomp = Client.stomp;
        Tower.stomp_subscriptions = Client._stomp_subscriptions;

        //open first section - channel
        Tower.section['default']();
    },

    //define the sections
    section: {

        'default': function () {
            var templatecheenltab = _.template('<li class="dropdown-item" href="#"><h4>CHANNELS</h4></li>' +
                '<hr />' +
                '<%=selecthtml%>');
            var templatecheenl = _.template('<li id="channelselectitem<%=indexid%>" class="dropdown-item" href="#" eventflag="channleselectfun" channeldata="<%=channlename%>"><%=channlename%></li>');


            $.when(
                utils.load({url: 'default.json'}),//channellist
                //common.load({ url: 'default.json' })//curchannel
            ).done(function (response) {

                //response[0]
                //response[1]

                statusUpdate(response);

                var channelsel = [];

                var channels = JSON.parse(response).data.attributes.allchannels;

                var ind = 1;
                for (var item in channels) {

                    channelsel.push(templatecheenl({channlename: item, indexid: ind}));
                    ind++;
                }

                $('#selectchannel').html(templatecheenltab({selecthtml: channelsel.join('')}));


                $("[eventflag='channleselectfun']").on('click', function (event) {

                    //alert( $(event.currentTarget).attr('channeldata') );

                })
            }).fail(function () {

                //alert(' I am default');

                statusUpdate({
                    status: 'DOWN',
                    peerCount: 'n/a',
                    latestBlock: 'n/a',
                    pendingTxn: 'n/a'
                });

            });

            var statusUpdate = function (response) {

                var status = response;

                utils.prettyUpdate(Tower.status.peerCount, status.peerCount, $('#default-peers'));
                utils.prettyUpdate(Tower.status.latestBlock, status.latestBlock, $('#default-blocks'));
                utils.prettyUpdate(Tower.status.txCount, status.txCount, $('#default-txn'));
                utils.prettyUpdate(Tower.status.chaincodeCount, status.chaincodeCount, $('#default-chaincode'));

                Tower.status = status;

                // Tower Control becomes ready only after the first status is received from the server
                if (!Tower.ready) {
                    Tower.isReady();
                }

                Dashboard.Utils.emit('node-status|announce');

            };

            utils.subscribe('/topic/metrics/status', statusUpdate);

        },

        'organization': function () {
            // data that the widgets will use
            var data = {
                'numUser': 4,
                'appName': 'sample app',
                'url': 'hello.com',
                'description': 'this is a description of the app.'
            }

            // the array of widgets that belong to the section,
            // these were preregistered in init() because they are unique

            var widgets = [


                {widgetId: 'network', data: data,refetch: true},

                /*{ widgetId: 'misc' },
                { widgetId: 'lab' },
                { widgetId: 'date' },
                { widgetId: 'controls' },
                { widgetId: 'weather' },
                { widgetId: 'info' , data: data}, //data can be passed in
                { widgetId: 'form' },*/

            ];

            utils.showHead(["default-channels","default-peers","default-chaincode"]);

            // opens the section and pass in the widgets that it needs
            Dashboard.showSection('organization', widgets);
        },

        'channel': function () {
            // data that the widgets will use
            var data = {
                'numUser': 4,
                'appName': 'sample app',
                'url': 'hello.com',
                'description': 'this is a description of the app.'
            }

            // the array of widgets that belong to the section,
            // these were preregistered in init() because they are unique

            var widgets = [

                {widgetId: 'blockinfo', data: {a: 'ddd', b: 'bbb'},refetch: true},
                {widgetId: 'blocklist', data: data,refetch: true},
                {widgetId: 'blockview', data: data,refetch: true},
                {widgetId: 'txdetail', data: data,refetch: true},
                {widgetId: 'peerlist', data: data,refetch: true},
                {widgetId: 'metrix_txn_sec', data: data,refetch: true},
                {widgetId: 'metrix_txn_min', data: data,refetch: true},
                {widgetId: 'metrix_block_min', data: data,refetch: true},
                // { widgetId: 'metrix_choc_tx' ,data: data},
                {widgetId: 'chaincodelist', data: data,refetch: true},
                

                /*{ widgetId: 'misc' },
                { widgetId: 'lab' },
                { widgetId: 'date' },
                { widgetId: 'controls' },
                { widgetId: 'weather' },
                { widgetId: 'info' , data: data}, //data can be passed in
                { widgetId: 'form' },*/

            ];

            utils.showHead(["default-peers","default-chaincode","default-blocks","default-txn"]);
            // opens the section and pass in the widgets that it needs
            Dashboard.showSection('channel', widgets);
        },

        // a section using same widget template for multiple widgets
        'peers': function () {
            // data that the widgets will use
            var data = {
                'numUser': 4,
                'appName': 'sample app',
                'url': 'hello.com',
                'description': 'this is a description of the app.'
            }

            // the array of widgets that belong to the section,
            // these were preregistered in init() because they are unique

            var widgets = [


                // { widgetId: 'metrix_choc_tx' ,data: data},
                {widgetId: 'channellist', data: data,refetch: true},
                {widgetId: 'chaincodelist', data: data,refetch: true},


                /*{ widgetId: 'misc' },
                { widgetId: 'lab' },
                { widgetId: 'date' },
                { widgetId: 'controls' },
                { widgetId: 'weather' },
                { widgetId: 'info' , data: data}, //data can be passed in
                { widgetId: 'form' },*/

            ];

            utils.showHead(["default-channels","default-chaincode"]);
            // opens the section and pass in the widgets that it needs
            Dashboard.showSection('peers', widgets);
        }
    },


    debug: function (message) {
        var _ref;
        return typeof window !== 'undefined' && window !== null ? (_ref = window.console) !== null ? _ref.log(message) : void 0 : void 0;
    }
};


$(function () {
    $(window).on('scroll', function (e) {
        if ($(window).scrollTop() > 50) {
            $('body').addClass('sticky');
        } else {
            $('body').removeClass('sticky');
        }
    });

    // logo handler
    $("a.tower-logo").click(function (e) {
        e.preventDefault();
        $("#channel").click();
    });

    // Menu (burger) handler
    $('.tower-toggle-btn').on('click', function () {
        $('.tower-logo-container').toggleClass('tower-nav-min');
        $('.tower-sidebar').toggleClass('tower-nav-min');
        $('.tower-body-wrapper').toggleClass('tower-nav-min');
    });


    // Navigation menu handler
    $('.tower-sidebar li').click(function (e) {

        var id = $(this).attr('id');

        e.preventDefault();

        Tower.current = id;

        $('.tower-sidebar li').removeClass('active');
        $(this).addClass('active');

        Tower.section[Tower.current]();

        $('#showTitle').html($('<span>', {html: $(this).find('.tower-sidebar-item').html()}));
        utils.showSelet(Tower.current);

    });

    // ---------- INIT -----------
    Tower.init();

    // Setting 'peers' as first section
    $('.tower-sidebar li').first().click();
});
