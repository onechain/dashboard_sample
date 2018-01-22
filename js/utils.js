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
        var targets=["channel","peers"];
        if(_.contains(targets, target)){
            $("#showSelectTitle").html('Select '+target+ '<b class="caret"></b>');
            $('#showSelect').show();
        }
    }
};

