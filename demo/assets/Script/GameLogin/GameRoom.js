var gameDefine = require("GameDefine");
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
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.roomId.string = cc.g_Global.RoomMsg.roomId;
    },

    leaveRoom : function () {
        let uid = cc.g_Global.HeroMsg.uid;
        pomelo.request(gameDefine.gameDefine.NET_ROUTE.ROUTE_LEAVE_ROOM, {uid : uid}, (msg)=>{
            console.log("离开房间", msg);
        });
    }
});
