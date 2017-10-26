var gameDefine = require("GameDefine");
var emitter = require("GlobalEvent");
cc.Class({
    extends: cc.Component,

    properties: {
        roomId : {
            default : null,
            type : cc.Label
        },
        Main : {
            default : null,
            type : cc.Label
        },
        UpPlayer : {
            default : null,
            type : cc.Label
        },
        DownPlayer : {
            default : null,
            type : cc.Label
        },
        startGameBtn : {
            default : null,
            type : cc.Node
        },
        _mainUid : "",
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.roomId.string = cc.g_Global.RoomMsg.roomId;
        let mainUid = cc.g_Global.RoomMsg.main;
        let Players = gameDefine.gameDefine.CloneJSON(cc.g_Global.RoomMsg.players);
        if (Players.hasOwnProperty(mainUid)) {
            self.Main.string = Players[mainUid].name;
            if (Players.hasOwnProperty(Players[mainUid].up)) {
                self.UpPlayer.string = Players[Players[mainUid].up].name;
            }
            if (Players.hasOwnProperty(Players[mainUid].down)) {
                self.DownPlayer.string = Players[Players[mainUid].down].name;
            }
        }
        self.Main.string = cc.g_Global.RoomMsg.main;
        self._mainUid = cc.g_Global.RoomMsg.main;
        emitter.emitterEvent.on(gameDefine.gameDefine.ON_GAME.UP_DATE_ROOM_MSG, self.node, self.updateRoomMsg, self);
        let myUid = cc.g_Global.HeroMsg.uid;
        if (myUid == self._mainUid) {
            self.startGameBtn.active = true;
        } else {
            self.startGameBtn.active = false;
        }
    },

    updateRoomMsg : function (msg) {
        let self = this;
        let room = msg.detail.room;
        console.log("更新房间数据", room);
        if (room.hasOwnProperty(room[self._mainUid].up)) {
            self.UpPlayer.string = room[room[self._mainUid].up].name;
        }
        if (room.hasOwnProperty(room[self._mainUid].down)) {
            self.DownPlayer.string = room[room[self._mainUid].down].name;
        }
    },

    startGame : function () {
        let self = this;
        pomelo.request(gameDefine.gameDefine.NET_ROUTE.ROUTE_START_FIGHT, {roomId : cc.g_Global.RoomMsg.roomId}, (msg)=>{cc.log(msg)});
    },

    leaveRoom : function () {
        let uid = cc.g_Global.HeroMsg.uid;
        pomelo.request(gameDefine.gameDefine.NET_ROUTE.ROUTE_LEAVE_ROOM, {uid : uid}, (msg)=>{
            console.log("离开房间", msg);
        });
    }
});
