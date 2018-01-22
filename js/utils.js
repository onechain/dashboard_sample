export default {
    load: function (opts) {
        var config = {
            type: opts.method ? opts.method : 'POST',
            url: opts.url,
            contentType: opts.type ? opts.type : 'application/json',
            cache: false,
            async: true
        };

        if (opts.data) {
            config.data = JSON.stringify(opts.data);
        }

        if (opts.complete) {
            config.complete = opts.complete;
        }

        return $.ajax(config);
    },

    subscribe: Client.subscribe,

    prettyUpdate: function (oldValue, newValue, el) {
        if (oldValue !== newValue) {
            el.css({
                'opacity': 0
            });

            setTimeout(function () {
                el.html($('<span>', {
                    html: newValue
                }));

                el.css({
                    'opacity': 1
                });
            }, 500);
        }
    },
    showHead: function (targets) {
        $("#heads-up > div").hide();
        $("#heads-up > div").removeClass();
        var l = 12 / targets.length
        _.each(targets, function (target) {
            $("#" + target).parent().parent().addClass("col-lg-" + l + " col-xs-6");
            $("#" + target).parent().parent().show();
        })
    },
    showSelet: function (target) {
        $('#showSelect').hide();
        var targets = [
            {name: 'channel', showText: "Channels", url: ''},
            {name: 'peers', showText: "Peers", url: ''}
        ]
        var selected = _.where(targets, {name: target});

        $("#showSelectContent").unbind('click');
        $('#showSelectContent').on('click', 'a', function (e) {
            e.preventDefault();
            Tower.section[Tower.current]();
        });

        _.each(selected, function (ele) {
            $("#showSelectTitle").html('Select ' + ele.name + '<b class="caret"></b>');


            // $.when(
            //     utils.load({url: ele.url})
            // ).done(function (data) {
            //     $("#showSelectContent").html('');
            //     _.each(data, function (item) {
            //         $("#showSelectContent").append('<li><a href="#">'+Item+'</a></li>')
            //     })
            // });

            $('#showSelect').show();
        });

    }
};

