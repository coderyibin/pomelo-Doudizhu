var emitter = require("GlobalEvent");
var Define = require("GameDefine");
var GlobalListener = cc.Class({
    ctor : function () {
        cc.log("全局监听类!");
        //监听进入房间
        pomelo.on(Define.gameDefine.ON_LISTENER.IN_ROOM, function (msg) {
            console.log("进入房间：", msg);
            cc.g_Global.RoomMsg.roomId = msg.roomId;
            cc.g_Global.RoomMsg.main = msg.main;
            emitter.emitterEvent.emit("comeInRoom", {msg : msg});
        });

        //监听房间数据
        pomelo.on(Define.gameDefine.ON_LISTENER.ROOM_MSG, (msg)=>{
            console.log("房间数据", msg);

        });
    }
});

module.exports = {
    globalListener : new GlobalListener()
}
