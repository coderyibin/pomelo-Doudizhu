module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
	this.channelServer = app.get("channelService");
	this.Player = {};
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
	console.log(roomId);
	if (! roomId) {
		next(null, {error : "数据格式有误!"});
		return;
	}
	var channel = this.channelServer.getChannel(roomId, false);
	if (!! channel) {
		var Uid = channel.getMember(uid);
		if (!! Uid) {
			next(null, {error : "玩家已在该房间"});
			return;
		}
        var sid = "connector-server-1";
		channel.add(uid, sid);
		console.log(channel.groups);
		var group = channel.groups[sid];
		var uids = [];
		for (var i = 0; i < group.length; i ++) {
			uids.push({uid : group[i], sid : sid});
		}
		next(null, {room : roomId, uid : uid});
		this.channelServer.pushMessageByUids("onJoinRoom", {roomId : roomId}, uids, null, function (rs) {
			if (!! rs) {
				console.log("推送失败", rs);
			} else {
				console.log("push ok!");
			}
        });
		var data = [{

		}];
		this.channelServer.pushMessageByUids("onJoinRoom", data, uids, null, function (rs) {
            if (!! rs) {
                console.log("推送失败", rs);
            } else {
                console.log("push ok!");
            }
        });
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
	};
    next(null, {room : roomId});
    this.channelServer.pushMessageByUids("onJoinRoom", {roomId : roomId}, uids, null, function (rs) {});
    var data = [{
    	uid : uid,
		roomId : roomId,
		main : true
	}];
    this.channelServer.pushMessageByUids("RoomMsg", data, [{uid : uid, sid : sid}], null, function (rs) {});
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
