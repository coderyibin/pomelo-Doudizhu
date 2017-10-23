var GameGlobal = cc.Class({
    ctor : function () {
        cc.log("游戏全局变量初始化！");
        let self = this;

    }
});

var Global = null;
(function () {
    if (!cc.sys.isObjectValid(Global)){
        Global = new GameGlobal();
    }
    return Global;
})();

cc.g_Global = module.exports.gameGlobal = Global;
