var GameDefine = {
    NET_ROUTE : {
        ROUTE_INIT: "gate.gateHandler.entry",
        ROUTE_LOGIN: "connector.entryHandler.login",
        ROUTE_CREAT_EROOM: "connector.entryHandler.createRoom",
        ROUTE_ADD_ROOM: "connector.entryHandler.addRoom",
        ROUTE_LEAVE_ROOM: "connector.entryHandler.leaveRoom",
    },

    ON_LISTENER : {
        ROOM_MSG : "onRoomMsg",
        IN_ROOM : "onJoinRoom",
    },

    load : function(){

    }
};
GameDefine.load();


module.exports.gameDefine = GameDefine;
