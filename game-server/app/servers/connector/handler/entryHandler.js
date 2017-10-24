module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
	this.channelServer = app.get("channelService");
	this.Player = {};
	this.RoomPlayer = {};
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  next(null, {code: 200, msg: 'game server is ok.'});
};

//用户登录
Handler.prototype.login = function(msg, session, next) {
	var self = this;
	if (!! msg) {
		var uid = msg.uid;
		var name = msg.name;
		var sessionService = self.app.get("sessionService");
		var sion = sessionService.getByUid(uid);
		if (!! sion) {
			next(null, {error : "该玩家已经登录"});
			return;
		}
		//将当前的session绑定一个uid
		session.bind(uid);
		self.Player[uid] = {
			uid : uid,
			name : name
		}
		next(null, {code : 200, uid : uid, name : name});
	} else  {
		next(null, {code: 400, error : "登录的数据格式有误"});
	}
};

//加入房间
Handler.prototype.addRoom = function (msg, session, next) {
	var self = this;
	var roomId = msg.room;
	var uid = msg.uid;
	if (! roomId) {
		next(null, {error : "数据格式有误!"});
		return;
	}
	var channel = this.channelServer.getChannel(roomId, false);
	if (!! channel) {//该房间存在
		var Uid = channel.getMember(uid);
		if (!! Uid) {
			next(null, {error : "玩家已在该房间"});
			return;
		}
        var sid = "connector-server-1";
		channel.add(uid, sid);
		console.log(channel.groups);
		var group = channel.groups[sid];
		if (group.length == 4) {
			next(null, {error : "该房间人满"});
			return;
		}
        var uids = [];
		for (var i = 0; i < group.length; i ++) {//消息推送给的对象
			uids.push({uid : group[i], sid : sid});
		}
        var roomMsg = self.RoomPlayer[roomId];
		var RoomMain = 0;//房主uid
		for (var i in roomMsg){
			if (roomMsg[i].main == roomMsg[i].uid) {
                RoomMain = roomMsg[i].uid;
                break;
			}
		}
        next(null, {room : roomId, uid : uid, main : RoomMain});
		//推送客户端进入房间
		this.channelServer.pushMessageByUids("onJoinRoom", {roomId : roomId, main : RoomMain}, [{uid : uid, sid : sid}], null, function (rs) {});
		//布局房主的上下家
		var MainMsg = roomMsg[RoomMain];
        if (! MainMsg.hasOwnProperty("up")) {
            MainMsg["up"] = uid;
        } else {
            MainMsg["down"] = uid;
        }
		//房间数据在加一个用户
        roomMsg[uid] = {
        	uid : self.Player[uid].uid,
			name : self.Player[uid].name,
			roomId : roomId,
		}
		if (group.length == 2) {//上家进入
        	roomMsg[uid]["up"] = null;
        	roomMsg[uid]["down"] = RoomMain;
		} else {//下家进入
            roomMsg[uid]["up"] = MainMsg.uid;
            roomMsg[uid]["down"] = MainMsg["up"];
            roomMsg[MainMsg.up]["up"] = uid;
		}
		//推送房间数据
		this.channelServer.pushMessageByUids("onRoomMsg", roomMsg, uids, null, function (rs) {});
        return;
	}
	next(null, {error : "该房间号不存在！"});
};

//创建房间
Handler.prototype.createRoom = function (msg, session, next) {
	var self = this;
	var uid = msg.uid;
    var roomId = self.randomRoomId();
	var channel = this.channelServer.createChannel(roomId);
    var sid = "connector-server-1";
    channel.add(msg.uid, sid);
    self.RoomPlayer[roomId] = {};
    if (self.RoomPlayer[roomId].hasOwnProperty(msg.uid)) {
    	next(null, {error : "该玩家已创建房间！"});
    	return;
	}
	self.RoomPlayer[roomId][msg.uid] = {
    	uid : self.Player[uid].uid,
		name : self.Player[uid].name,
		roomId : roomId,
		main : uid
	};
    next(null, {room : roomId});
    var uids = [{uid : uid, sid : sid}];
    this.channelServer.pushMessageByUids("onJoinRoom", {roomId : roomId, main : uid}, uids, null, function (rs) {});
    var data = [{
    	uid : self.RoomPlayer[roomId][uid].uid,
		roomId : self.RoomPlayer[roomId][uid].roomId,
		main : self.RoomPlayer[roomId][uid].main,
		up : null,
		down : null
	}];
    this.channelServer.pushMessageByUids("onRoomMsg", data, uids, null, function (rs) {});
};

//随机生成房间号
Handler.prototype.randomRoomId = function () {
    var str = "0123456789";
    var n = 4, s = "";
    for(var i = 0; i < n; i++){
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
    }
    var bool = this.channelServer.getChannel(s, false);
    if (!! bool) {
    	this.randomRoomId();
    	return;
	}
    return s;
}

Handler.prototype.leaveRoom = function (msg, session, next) {
	var uid = msg.uid;
	for (var i in this.RoomPlayer) {
        if (this.RoomPlayer[i].hasOwnProperty(uid)) {
        	var player = this.RoomPlayer[i];
        	var roomId = i;
        	delete player.uid;
        	break;
		}
	}
    var channel = this.channelServer.getChannel(roomId, false);
    if (!! channel) {
        var sid = "connector-server-1";
        channel.leave(uid, sid);
        next(null, {msg : "离开房间"});
        return;
	}
	next(null, {error : 500});
}

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
