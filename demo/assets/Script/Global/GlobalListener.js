var emitter = require("GlobalEvent");
var GlobalListener = cc.Class({
    ctor : function () {
        cc.log("全局监听类!");
        //监听进入房间
        pomelo.on("onJoinRoom", function (msg) {
            console.log(msg);
            emitter.emitterEvent.emit("comeInRoom", {msg : msg});
        })
    }
});

module.exports = {
    globalListener : new GlobalListener()
}
