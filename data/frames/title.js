
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout();

        frame.after(1, function() {
            frame.model().clear();
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().title = '<h1 style="visibility:visible">Raft</h1>'
                        + '<h2 style="visibility:visible">容易理解的<em>Distributed Consensus</em>分布式共识算法</h2>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().subtitle = '<p style="visibility:visible"><em><a href="http://www.kailing.pub/feedback/index.html" target="_blank">有任务问题，可按此提供建议</a></em></h1>';
            layout.invalidate();
            frame.model().controls.show();
        })

        .after(100, function () {
            player.next();
        })
        
        player.play();
    };
});
