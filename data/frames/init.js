
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./playground", "./title", "./intro", "./overview", "./election", "./replication", "./conclusion"],
    function (playground, title, intro, overview, election, replication, conclusion) {
        return function (player) {
            player.frame("home", "Home | 主页", title);
            player.frame("intro", "Distributed Consensus | 分布式共识 ", intro);
            player.frame("overview", "Protocol Overview | 协议概述", overview);
            player.frame("election", "Leader Election | 领导选举", election);
            player.frame("replication", "Log Replication | 日志复制", replication);
            player.frame("conclusion", "Other Resources | 其他资源", conclusion);
        };
    });
