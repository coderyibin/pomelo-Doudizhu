var GameDefine = {
    NET_ROUTE : {
        ROUTE_INIT: "gate.gateHandler.entry",
        ROUTE_LOGIN: "connector.entryHandler.login",
        ROUTE_CREAT_EROOM: "connector.entryHandler.createRoom",
        ROUTE_ADD_ROOM: "connector.entryHandler.addRoom",
    },

    load : function(){

    }
};
GameDefine.load();


module.exports.gameDefine = GameDefine;
