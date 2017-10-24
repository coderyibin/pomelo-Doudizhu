var EmitterEvent = cc.Class({
    ctor : function () {
        cc.log("事件监听器初始化");
        let self = this;
        self._eventArr = [];
    },

    /**
     * 注册监听器
     * @param 监听器名称
     * @param 监听器所绑定节点
     * @param 回调函数
     * @param 上下文
     * @param 监听器可执行次数 =1则是一次性监听器*/
    on : function (event, node, cb, ctx, time=2) {
        let self = this;
        self._eventArr.push({
            name : event,
            node : node,
            cb : cb,
            ctx : ctx,
            time : time
        });
        node.on(event, cb, ctx);
        // cc.systemEvent.on(event, cb, ctx);
    },

    emit : function (event, detail) {
        let self = this;
        for (let i = 0 ; i < self._eventArr.length; i ++) {
            let _event = self._eventArr[i];
            if (event == _event.name) {
                _event.node.emit(event, detail);
                if (_event.time == 1) {
                    _event.node.off(event, _event.cb, _event.ctx);
                    break;
                }
                break;
            }
        }
        // cc.systemEvent.emit(event, detail);
    },

    un : function (event, cb, ctx) {
        cc.systemEvent.off(event, cb, ctx);
    },

});

module.exports.emitterEvent = new EmitterEvent();