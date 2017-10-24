var gameDefine = require("GameDefine");
var emitter = require("GlobalEvent");
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        Name: {
            default: null,
            type: cc.EditBox
        },
        Room: {
            default: null,
            type: cc.EditBox
        },
        loginNode : {
            default : null,
            type : cc.Node
        },
        MenuNode : {
            default : null,
            type : cc.Node
        },
        addRoomNode : {
            default : null,
            type : cc.Node
        },
        createNode : {
            default : null,
            type : cc.Node
        },
        addNode : {
            default : null,
            type : cc.Node
        },

        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        host: "127.0.0.1",
        port : "10086",
        _userId : "",
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.loginNode.active = true;
        self.MenuNode.active = false;
        self.addRoomNode.active = false;
        self.createNode.active = false;
        self.addNode.active = false;
        emitter.emitterEvent.on("comeInRoom", self.node, (event)=>{
            console.log(event.detail.msg);
            let msg = event.detail.msg;
            self.ComeInRoom(msg);
        }, self, 1);
    },

    login : function () {
        let self = this;
        var name = self.Name.string;

        pomelo.init({
            host : this.host,
            port : this.port
        }, ()=> {
            var _name = name;
            var rou = gameDefine.gameDefine.NET_ROUTE.ROUTE_INIT;
            pomelo.request(rou, {
            }, (rs)=> {
                console.log("init ok", rs);
                pomelo.disconnect(function () {
                    pomelo.init({host : rs.host, port : rs.port}, ()=> {
                        var rout = gameDefine.gameDefine.NET_ROUTE.ROUTE_LOGIN
                        pomelo.request(rout, {
                            uid : _name,
                            name : _name
                        }, (m)=> {
                            console.log(m);
                            self._userId = m.uid;
                            self.loginNode.active = false;
                            self.MenuNode.active = true;
                            cc.g_Global.HeroMsg.uid = m.uid;
                        });
                    });
                });
            })
        });
    },

    showCreateNode : function () {
        let self = this;
        this.createNode.active = true;
        self.MenuNode.active = false;
    },

    showAddNode : function () {
        let self = this;
        this.addNode.active = true;
        self.MenuNode.active = false;
    },

    addRoom :function () {
        let self = this;
        let roomId = self.Room.string;
        pomelo.request(gameDefine.gameDefine.NET_ROUTE.ROUTE_ADD_ROOM, {uid : self._userId, room : roomId}, (msg)=>{
            console.log("加入房间号是roomId" , msg.room);
        });
    },

    createRoom : function () {
        let self = this;
        let roomId = self.Room.string;
        pomelo.request(gameDefine.gameDefine.NET_ROUTE.ROUTE_CREAT_EROOM, {uid : self._userId}, (msg)=>{
            console.log("创建成功，房间号是roomId" , msg.room);
        })
    },

    ComeInRoom (msg) {
        cc.director.loadScene("GameRoom");
    }
});
