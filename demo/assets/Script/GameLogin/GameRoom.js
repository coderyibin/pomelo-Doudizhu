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

    },

    HelloWorldCallBack : function (msg) {
        let self = this;
        console.log(msg);
    }
});
