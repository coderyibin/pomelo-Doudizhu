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
            let uid = cc.g_Global.RoomMsg.main;
            cc.g_Global.RoomMsg.players = msg;//房间的所有玩家数据
            if (msg.hasOwnProperty(uid)) {//当前客户端玩家的数据
                cc.g_Global.HeroMsg.uid = msg[uid].uid;
                cc.g_Global.HeroMsg.name = msg[uid].name;
                cc.g_Global.HeroMsg.roomId = msg[uid].roomId;
                cc.g_Global.HeroMsg.UpMsg.uid = msg[uid].up;
                cc.g_Global.HeroMsg.DownMsg.uid = msg[uid].down;
            }
            emitter.emitterEvent.emit(Define.gameDefine.ON_GAME.UP_DATE_ROOM_MSG, {room : msg});
        });
    }
});

module.exports = {
    globalListener : new GlobalListener()
}
