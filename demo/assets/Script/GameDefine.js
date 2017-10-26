var GameDefine = {
    //网络路由
    NET_ROUTE : {
        ROUTE_INIT: "gate.gateHandler.entry",
        ROUTE_LOGIN: "connector.entryHandler.login",
        ROUTE_CREAT_EROOM: "connector.entryHandler.createRoom",
        ROUTE_ADD_ROOM: "connector.entryHandler.addRoom",
        ROUTE_LEAVE_ROOM: "connector.entryHandler.leaveRoom",
        ROUTE_START_FIGHT: "fight.fightHandler.startFight",
    },

    //网络监听器key
    ON_LISTENER : {
        ROOM_MSG : "onRoomMsg",
        IN_ROOM : "onJoinRoom",
        IN_FIGHT : "onJoinFight",
    },

    //游戏监听器
    ON_GAME : {
        UP_DATE_ROOM_MSG : "onUpdateRoomMsg",
    },

    //克隆json数据
    CloneJSON : function (json) {
        return JSON.parse(JSON.stringify(json));
    },

    load : function(){

    }
};

module.exports.gameDefine = GameDefine;
