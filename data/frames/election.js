
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            cluster = function(value) { model().nodes.toArray().forEach(function(node) { node.cluster(value); }); },
            wait = function() { var self = this; model().controls.show(function() { self.stop(); }); },
            subtitle = function(s, pause) { model().subtitle = s + model().controls.html(); layout.invalidate(); if (pause === undefined) { model().controls.show() }; };

        //------------------------------
        // Title
        //------------------------------
        frame.after(1, function() {
            model().clear();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().title = '<h2 style="visibility:visible">领导者选举</h1>'
                                + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(200, wait).indefinite()
        .after(500, function () {
            model().title = "";
            layout.invalidate();
        })

        //------------------------------
        // Initialization
        //------------------------------
        .after(300, function () {
            model().nodes.create("A").init();
            model().nodes.create("B").init();
            model().nodes.create("C").init();
            cluster(["A", "B", "C"]);
        })

        //------------------------------
        // Election Timeout
        //------------------------------
        .after(1, function () {
            model().ensureSingleCandidate();
            model().subtitle = '<h2>在Raft中，有两个超时设置可控制选举。</h2>'
                           + model().controls.html();
            layout.invalidate();
        })
        .after(model().electionTimeout / 2, function() { model().controls.show(); })
        .after(100, function () {
            subtitle('<h2>首先是<span style="color:green">election timeout</span>选举超时。</h2>');
        })
        .after(1, function() {
            subtitle('<h2><em>election timeout</em>选举超时是指<em>followers</em>跟随者成为<em>candidates</em>候选者之前所等待的时间。</h2>');
        })
        .after(1, function() {
            subtitle('<h2>[<em>election timeout</em>被随机分配在150毫秒至300毫秒之间。</h2>');
        })
        .after(1, function() {
            subtitle("", false);
        })

        //------------------------------
        // Candidacy
        //------------------------------
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "candidate");
        })
        .after(1, function () {
            subtitle('<h2>选举超时后，跟随者成为候选者并开始新的<em>election term</em>选举任期...</h2>');
        })
        .after(1, function () {
            subtitle('<h2>...为自己投票...</h2>');
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>...并向其他节点发送 <em>Request Vote</em> 请求投票消息</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>如果接收节点在这个学期中还没有投票，那么它将投票给候选人...</h2>');
        })
        .after(1, function () {
            subtitle('<h2>...并且节点将重置其<span style="color:green">election timeout</span>选举超时.</h2>');
        })


        //------------------------------
        // Leadership & heartbeat timeout.
        //------------------------------
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            subtitle('<h2>一旦候选人获得多数票，便成为领导者。</h2>');
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>领导者开始向其追随者发送<em>Append Entries</em>追加条目消息</h2>');
        })
        .after(1, function () {
            subtitle('<h2>这些消息以<span style="color:red">heartbeat timeout</span>心跳超时指定的时间间隔发送。</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>跟随者然后响应每个<em>Append Entries</em> 追加条目消息。.</h2>');
        })
        .after(1, function () {
            subtitle('', false);
        })
        .after(model().heartbeatTimeout * 2, function () {
            subtitle('<h2>此选举任期将持续到追随者停止接收心跳并成为候选人为止。</h2>', false);
        })
        .after(100, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
        })

        //------------------------------
        // Leader re-election
        //------------------------------
        .after(model().heartbeatTimeout * 2, function () {
            subtitle('<h2>让我们停止领导者节点，观察选举情况。</h2>', false);
        })
        .after(100, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
            model().leader().state("stopped")
        })
        .after(model().defaultNetworkLatency, function () {
            model().ensureSingleCandidate()
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            subtitle('<h2>节点 ' + model().leader().id + '现在是任期 ' + model().leader().currentTerm() + '的领导者</h2>', false);
        })
        .after(1, wait).indefinite()

        //------------------------------
        // Split Vote
        //------------------------------
        .after(1, function () {
            subtitle('<h2>要获得多数票，可以确保每个任期只能选出一位领导者。</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('<h2>如果两个节点同时成为候选节点，则可能会发生分裂投票。</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('<h2>让我们看一个分裂投票的例子...</h2>', false);
        })
        .after(1, wait).indefinite()
        .after(1, function () {
            subtitle('', false);
            model().nodes.create("D").init().currentTerm(node("A").currentTerm());
            cluster(["A", "B", "C", "D"]);

            // Make sure two nodes become candidates at the same time.
            model().resetToNextTerm();
            var nodes = model().ensureSplitVote();

            // Increase latency to some nodes to ensure obvious split.
            model().latency(nodes[0].id, nodes[2].id, model().defaultNetworkLatency * 1.25);
            model().latency(nodes[1].id, nodes[3].id, model().defaultNetworkLatency * 1.25);
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "candidate");
        })
        .after(model().defaultNetworkLatency * 0.25, function () {
            subtitle('<h2>两个节点都开始以相同的任期进行选举...</h2>');
        })
        .after(model().defaultNetworkLatency * 0.75, function () {
            subtitle('<h2>...每个都先到达一个跟随者节点。</h2>');
        })
        .after(model().defaultNetworkLatency, function () {
            subtitle('<h2>现在，每个候选人都有2票，并且在这个任期中将无法获得更多选票。</h2>');
        })
        .after(1, function () {
            subtitle('<h2>节点将等待新的选举，然后再试一次。</h2>', false);
        })
        .at(model(), "stateChange", function(event) {
            return (event.target.state() === "leader");
        })
        .after(1, function () {
            model().resetLatencies();
            subtitle('<h2>节点 ' + model().leader().id + ' 在任期内获得多数选票 ' + model().leader().currentTerm() + '所以它成为新的领导者。</h2>', false);
        })
        .after(1, wait).indefinite()

        .then(function() {
            player.next();
        })


        player.play();
    };
});
