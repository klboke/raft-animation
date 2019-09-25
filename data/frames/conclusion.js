
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
            frame.model().title = '<h1 style="visibility:visible">结束了</h1>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().controls.show();
        })

        .after(500, function () {
            frame.model().title = '<h2 style="visibility:visible">更多资源信息:</h2>'
                        + '<h3 style="visibility:visible"><a href="https://github.com/maemual/raft-zh_cn/blob/master/raft-zh_cn.md">Raft论文译文</a></h3>'
                        + '<h3 style="visibility:visible"><a href="http://raftconsensus.github.io/">Raft官方站点</a></h3>'
                        + '<h3 style="visibility:visible"><a href="http://thesecretlivesofdata.com/raft/">Raft英文原版</a></h3>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        
        player.play();
    };
});
