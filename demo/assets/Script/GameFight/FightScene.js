var Define = require("GameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        UpPlayer : {
            default : null,
            type : cc.Label
        },
        DownPlayer : {
            default : null,
            type : cc.Label
        },
        MyPlayer : {
            default : null,
            type : cc.Label
        },
        _myMsg : null,
        _mainUid : null,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        let players = Define.gameDefine.CloneJSON(cc.g_Global.RoomMsg.players);
        self._myMsg = cc.g_Global.HeroMsg;
        if (players.hasOwnProperty(self._myMsg.uid)) {
            let msg = players[self._myMsg.uid];
            self.MyPlayer.string = msg.name;
            self.UpPlayer.string = players[msg.up].name;
            self.DownPlayer.string = players[msg.down].name;
        }
    },
});
