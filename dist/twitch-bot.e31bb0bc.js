// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/comfy.js/vendor/tmi.min.js":[function(require,module,exports) {
var global = arguments[3];
!function(){function e(t,s,n){function i(r,a){if(!s[r]){if(!t[r]){var c="function"==typeof require&&require;if(!a&&c)return c(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var u=s[r]={exports:{}};t[r][0].call(u.exports,function(e){var s=t[r][1][e];return i(s||e)},u,u.exports,e,t,s,n)}return s[r].exports}for(var o="function"==typeof require&&require,r=0;r<n.length;r++)i(n[r]);return i}return e}()({1:[function(e,t,s){"use strict";t.exports={client:e("./lib/client"),Client:e("./lib/client")}},{"./lib/client":3}],2:[function(e,t,s){"use strict";var n=e("request"),i=e("./utils"),o=function(e,t){var s=null===i.get(e.url,null)?i.get(e.uri,null):i.get(e.url,null);if(i.isURL(s)||(s="https://api.twitch.tv/kraken"+("/"===s[0]?s:"/"+s)),i.isNode())n(i.merge({method:"GET",json:!0},e,{url:s}),t);else if(i.isExtension()){e=i.merge({url:s,method:"GET",headers:{}},e);var o=new XMLHttpRequest;o.open(e.method,e.url,!0);for(var r in e.headers)o.setRequestHeader(r,e.headers[r]);o.responseType="json",o.addEventListener("load",function(e){4==o.readyState&&(200!=o.status?t(o.status,null,null):t(null,null,o.response))}),o.send()}else{var a="jsonp_callback_"+Math.round(1e5*Math.random());window[a]=function(e){delete window[a],document.body.removeChild(c),t(null,null,e)};var c=document.createElement("script");c.src=""+s+(s.includes("?")?"&":"?")+"callback="+a,document.body.appendChild(c)}};t.exports=o},{"./utils":10,request:11}],3:[function(e,t,s){(function(s){"use strict";var n=e("./api"),i=e("./commands"),o=e("./events").EventEmitter,r=e("./logger"),a=e("./parser"),c=e("./timer"),l=e("./extra-utils"),u=s.WebSocket||s.MozWebSocket||e("ws"),h=e("./utils"),m=function p(e){if(this instanceof p==!1)return new p(e);this.setMaxListeners(0),this.opts=h.get(e,{}),this.opts.channels=this.opts.channels||[],this.opts.connection=this.opts.connection||{},this.opts.identity=this.opts.identity||{},this.opts.options=this.opts.options||{},this.clientId=h.get(this.opts.options.clientId,null),this.maxReconnectAttempts=h.get(this.opts.connection.maxReconnectAttempts,1/0),this.maxReconnectInterval=h.get(this.opts.connection.maxReconnectInterval,3e4),this.reconnect=h.get(this.opts.connection.reconnect,!1),this.reconnectDecay=h.get(this.opts.connection.reconnectDecay,1.5),this.reconnectInterval=h.get(this.opts.connection.reconnectInterval,1e3),this.reconnecting=!1,this.reconnections=0,this.reconnectTimer=this.reconnectInterval,this.secure=h.get(this.opts.connection.secure,!1),this.emotes="",this.emotesets={},this.channels=[],this.currentLatency=0,this.globaluserstate={},this.lastJoined="",this.latency=new Date,this.moderators={},this.pingLoop=null,this.pingTimeout=null,this.reason="",this.username="",this.userstate={},this.wasCloseCalled=!1,this.ws=null;var t="error";this.opts.options.debug&&(t="info"),this.log=this.opts.logger||r;try{r.setLevel(t)}catch(s){}this.opts.channels.forEach(function(e,t,s){s[t]=h.channel(e)}),o.call(this)};h.inherits(m,o),m.prototype.api=n;for(var f in i)m.prototype[f]=i[f];m.prototype.handleMessage=function(e){var t=this;if(!h.isNull(e)){this.emit("raw_message",JSON.parse(JSON.stringify(e)),e);var s=h.channel(h.get(e.params[0],null)),n=h.get(e.params[1],null),i=h.get(e.tags["msg-id"],null);if(e.tags=a.badges(a.emotes(e.tags)),e.tags)for(var o in e.tags)"emote-sets"!==o&&"ban-duration"!==o&&"bits"!==o&&(h.isBoolean(e.tags[o])?e.tags[o]=null:"1"===e.tags[o]?e.tags[o]=!0:"0"===e.tags[o]&&(e.tags[o]=!1));if(h.isNull(e.prefix))switch(e.command){case"PING":this.emit("ping"),h.isNull(this.ws)||2===this.ws.readyState||3===this.ws.readyState||this.ws.send("PONG");break;case"PONG":var r=new Date;this.currentLatency=(r.getTime()-this.latency.getTime())/1e3,this.emits(["pong","_promisePing"],[[this.currentLatency]]),clearTimeout(this.pingTimeout);break;default:this.log.warn("Could not parse message with no prefix:\n"+JSON.stringify(e,null,4))}else if("tmi.twitch.tv"===e.prefix)switch(e.command){case"002":case"003":case"004":case"375":case"376":case"CAP":break;case"001":this.username=e.params[0];break;case"372":this.log.info("Connected to server."),this.userstate["#tmijs"]={},this.emits(["connected","_promiseConnect"],[[this.server,this.port],[null]]),this.reconnections=0,this.reconnectTimer=this.reconnectInterval,this.pingLoop=setInterval(function(){h.isNull(t.ws)||2===t.ws.readyState||3===t.ws.readyState||t.ws.send("PING"),t.latency=new Date,t.pingTimeout=setTimeout(function(){h.isNull(t.ws)||(t.wasCloseCalled=!1,t.log.error("Ping timeout."),t.ws.close(),clearInterval(t.pingLoop),clearTimeout(t.pingTimeout))},h.get(t.opts.connection.timeout,9999))},6e4);var l=new c.queue(2e3),u=h.union(this.opts.channels,this.channels);this.channels=[];for(var m=0;m<u.length;m++){var f=this;l.add(function(e){h.isNull(f.ws)||2===f.ws.readyState||3===f.ws.readyState||f.ws.send("JOIN "+h.channel(u[e]))}.bind(this,m))}l.run();break;case"NOTICE":var p=[null],d=[s,i,n],g=[i],_=[s,!0],b=[s,!1],v=[d,p],y=[d,g],w="["+s+"] "+n;switch(i){case"subs_on":this.log.info("["+s+"] This room is now in subscribers-only mode."),this.emits(["subscriber","subscribers","_promiseSubscribers"],[_,_,p]);break;case"subs_off":this.log.info("["+s+"] This room is no longer in subscribers-only mode."),this.emits(["subscriber","subscribers","_promiseSubscribersoff"],[b,b,p]);break;case"emote_only_on":this.log.info("["+s+"] This room is now in emote-only mode."),this.emits(["emoteonly","_promiseEmoteonly"],[_,p]);break;case"emote_only_off":this.log.info("["+s+"] This room is no longer in emote-only mode."),this.emits(["emoteonly","_promiseEmoteonlyoff"],[b,p]);break;case"slow_on":case"slow_off":break;case"followers_on_zero":case"followers_on":case"followers_off":break;case"r9k_on":this.log.info("["+s+"] This room is now in r9k mode."),this.emits(["r9kmode","r9kbeta","_promiseR9kbeta"],[_,_,p]);break;case"r9k_off":this.log.info("["+s+"] This room is no longer in r9k mode."),this.emits(["r9kmode","r9kbeta","_promiseR9kbetaoff"],[b,b,p]);break;case"room_mods":var C=n.split(": ")[1].toLowerCase().split(", ").filter(function(e){return e});this.emits(["_promiseMods","mods"],[[null,C],[s,C]]);break;case"no_mods":this.emits(["_promiseMods","mods"],[[null,[]],[s,[]]]);break;case"vips_success":n.endsWith(".")&&(n=n.slice(0,-1));var k=n.split(": ")[1].toLowerCase().split(", ").filter(function(e){return e});this.emits(["_promiseVips","vips"],[[null,k],[s,k]]);break;case"no_vips":this.emits(["_promiseVips","vips"],[[null,[]],[s,[]]]);break;case"already_banned":case"bad_ban_admin":case"bad_ban_broadcaster":case"bad_ban_global_mod":case"bad_ban_self":case"bad_ban_staff":case"usage_ban":this.log.info(w),this.emits(["notice","_promiseBan"],y);break;case"ban_success":this.log.info(w),this.emits(["notice","_promiseBan"],v);break;case"usage_clear":this.log.info(w),this.emits(["notice","_promiseClear"],y);break;case"usage_mods":this.log.info(w),this.emits(["notice","_promiseMods"],[d,[i,[]]]);break;case"mod_success":this.log.info(w),this.emits(["notice","_promiseMod"],v);break;case"usage_vips":this.log.info(w),this.emits(["notice","_promiseVips"],[d,[i,[]]]);break;case"usage_vip":case"bad_vip_grantee_banned":case"bad_vip_grantee_already_vip":this.log.info(w),this.emits(["notice","_promiseVip"],[d,[i,[]]]);break;case"vip_success":this.log.info(w),this.emits(["notice","_promiseVip"],v);break;case"usage_mod":case"bad_mod_banned":case"bad_mod_mod":this.log.info(w),this.emits(["notice","_promiseMod"],y);break;case"unmod_success":this.log.info(w),this.emits(["notice","_promiseUnmod"],v);break;case"unvip_success":this.log.info(w),this.emits(["notice","_promiseUnvip"],v);break;case"usage_unmod":case"bad_unmod_mod":this.log.info(w),this.emits(["notice","_promiseUnmod"],y);break;case"usage_unvip":case"bad_unvip_grantee_not_vip":this.log.info(w),this.emits(["notice","_promiseUnvip"],y);break;case"color_changed":this.log.info(w),this.emits(["notice","_promiseColor"],v);break;case"usage_color":case"turbo_only_color":this.log.info(w),this.emits(["notice","_promiseColor"],y);break;case"commercial_success":this.log.info(w),this.emits(["notice","_promiseCommercial"],v);break;case"usage_commercial":case"bad_commercial_error":this.log.info(w),this.emits(["notice","_promiseCommercial"],y);break;case"hosts_remaining":this.log.info(w);var T=isNaN(n[0])?0:parseInt(n[0]);this.emits(["notice","_promiseHost"],[d,[null,~~T]]);break;case"bad_host_hosting":case"bad_host_rate_exceeded":case"bad_host_error":case"usage_host":this.log.info(w),this.emits(["notice","_promiseHost"],[d,[i,null]]);break;case"already_r9k_on":case"usage_r9k_on":this.log.info(w),this.emits(["notice","_promiseR9kbeta"],y);break;case"already_r9k_off":case"usage_r9k_off":this.log.info(w),this.emits(["notice","_promiseR9kbetaoff"],y);break;case"timeout_success":this.log.info(w),this.emits(["notice","_promiseTimeout"],v);break;case"delete_message_success":this.log.info("["+s+" "+n+"]"),this.emits(["notice","_promiseDeletemessage"],v);case"already_subs_off":case"usage_subs_off":this.log.info(w),this.emits(["notice","_promiseSubscribersoff"],y);break;case"already_subs_on":case"usage_subs_on":this.log.info(w),this.emits(["notice","_promiseSubscribers"],y);break;case"already_emote_only_off":case"usage_emote_only_off":this.log.info(w),this.emits(["notice","_promiseEmoteonlyoff"],y);break;case"already_emote_only_on":case"usage_emote_only_on":this.log.info(w),this.emits(["notice","_promiseEmoteonly"],y);break;case"usage_slow_on":this.log.info(w),this.emits(["notice","_promiseSlow"],y);break;case"usage_slow_off":this.log.info(w),this.emits(["notice","_promiseSlowoff"],y);break;case"usage_timeout":case"bad_timeout_admin":case"bad_timeout_broadcaster":case"bad_timeout_duration":case"bad_timeout_global_mod":case"bad_timeout_self":case"bad_timeout_staff":this.log.info(w),this.emits(["notice","_promiseTimeout"],y);break;case"untimeout_success":case"unban_success":this.log.info(w),this.emits(["notice","_promiseUnban"],v);break;case"usage_unban":case"bad_unban_no_ban":this.log.info(w),this.emits(["notice","_promiseUnban"],y);break;case"usage_delete":case"bad_delete_message_error":case"bad_delete_message_broadcaster":case"bad_delete_message_mod":this.log.info(w),this.emits(["notice","_promiseDeletemessage"],y);break;case"usage_unhost":case"not_hosting":this.log.info(w),this.emits(["notice","_promiseUnhost"],y);break;case"whisper_invalid_login":case"whisper_invalid_self":case"whisper_limit_per_min":case"whisper_limit_per_sec":case"whisper_restricted_recipient":this.log.info(w),this.emits(["notice","_promiseWhisper"],y);break;case"no_permission":case"msg_banned":case"msg_room_not_found":case"msg_channel_suspended":case"tos_ban":this.log.info(w),this.emits(["notice","_promiseBan","_promiseClear","_promiseUnban","_promiseTimeout","_promiseDeletemessage","_promiseMods","_promiseMod","_promiseUnmod","_promiseVips","_promiseVip","_promiseUnvip","_promiseCommercial","_promiseHost","_promiseUnhost","_promiseJoin","_promisePart","_promiseR9kbeta","_promiseR9kbetaoff","_promiseSlow","_promiseSlowoff","_promiseFollowers","_promiseFollowersoff","_promiseSubscribers","_promiseSubscribersoff","_promiseEmoteonly","_promiseEmoteonlyoff"],y);break;case"unrecognized_cmd":this.log.info(w),this.emit("notice",s,i,n),"/w"===n.split(" ").splice(-1)[0]&&this.log.warn("You must be connected to a group server to send or receive whispers.");break;case"cmds_available":case"host_target_went_offline":case"msg_censored_broadcaster":case"msg_duplicate":case"msg_emoteonly":case"msg_verified_email":case"msg_ratelimit":case"msg_subsonly":case"msg_timedout":case"msg_bad_characters":case"msg_channel_blocked":case"msg_facebook":case"msg_followersonly":case"msg_followersonly_followed":case"msg_followersonly_zero":case"msg_rejected":case"msg_slowmode":case"msg_suspended":case"no_help":case"usage_disconnect":case"usage_help":case"usage_me":this.log.info(w),this.emit("notice",s,i,n);break;case"host_on":case"host_off":break;default:n.includes("Login unsuccessful")||n.includes("Login authentication failed")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason=n,this.log.error(this.reason),this.ws.close()):n.includes("Error logging in")||n.includes("Improperly formatted auth")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason=n,this.log.error(this.reason),this.ws.close()):n.includes("Invalid NICK")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason="Invalid NICK.",this.log.error(this.reason),this.ws.close()):this.log.warn("Could not parse NOTICE from tmi.twitch.tv:\n"+JSON.stringify(e,null,4))}break;case"USERNOTICE":var x=e.tags["display-name"]||e.tags.login,S=e.tags["msg-param-sub-plan"]||"",E=h.unescapeIRC(h.get(e.tags["msg-param-sub-plan-name"],""))||null,N=S.includes("Prime"),P=e.tags,L=~~(e.tags["msg-param-streak-months"]||0),O=e.tags["msg-param-recipient-display-name"]||e.tags["msg-param-recipient-user-name"],D=~~e.tags["msg-param-mass-gift-count"],I={prime:N,plan:S,planName:E};switch(P["message-type"]=i,i){case"resub":this.emits(["resub","subanniversary"],[[s,x,L,n,P,I]]);break;case"sub":this.emit("subscription",s,x,I,n,P);break;case"subgift":this.emit("subgift",s,x,L,O,I,P);break;case"anonsubgift":this.emit("anonsubgift",s,L,O,I,P);break;case"submysterygift":this.emit("submysterygift",s,x,D,I,P);break;case"anonsubmysterygift":this.emit("anonsubmysterygift",s,D,I,P);break;case"giftpaidupgrade":var R=e.tags["msg-param-sender-name"]||e.tags["msg-param-sender-login"];this.emit("giftpaidupgrade",s,x,R,P);break;case"anongiftpaidupgrade":this.emit("anongiftpaidupgrade",s,x,P);break;case"raid":var x=e.tags["msg-param-displayName"]||e.tags["msg-param-login"],M=e.tags["msg-param-viewerCount"];this.emit("raided",s,x,M)}break;case"HOSTTARGET":var A=n.split(" "),M=~~A[1]||0;"-"===A[0]?(this.log.info("["+s+"] Exited host mode."),this.emits(["unhost","_promiseUnhost"],[[s,M],[null]])):(this.log.info("["+s+"] Now hosting "+A[0]+" for "+M+" viewer(s)."),this.emit("hosting",s,A[0],M));break;case"CLEARCHAT":if(e.params.length>1){var U=h.get(e.tags["ban-duration"],null);h.isNull(U)?(this.log.info("["+s+"] "+n+" has been banned."),this.emit("ban",s,n,null,e.tags)):(this.log.info("["+s+"] "+n+" has been timed out for "+U+" seconds."),this.emit("timeout",s,n,null,~~U,e.tags))}else this.log.info("["+s+"] Chat was cleared by a moderator."),this.emits(["clearchat","_promiseClear"],[[s],[null]]);break;case"CLEARMSG":if(e.params.length>1){var x=e.tags.login,j=n,P=e.tags;P["message-type"]="messagedeleted",this.log.info("["+s+"] "+x+"'s message has been deleted."),this.emit("messagedeleted",s,x,j,P)}break;case"RECONNECT":this.log.info("Received RECONNECT request from Twitch.."),this.log.info("Disconnecting and reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.disconnect(),setTimeout(function(){t.connect()},this.reconnectTimer);break;case"SERVERCHANGE":break;case"USERSTATE":e.tags.username=this.username,"mod"===e.tags["user-type"]&&(this.moderators[this.lastJoined]||(this.moderators[this.lastJoined]=[]),this.moderators[this.lastJoined].includes(this.username)||this.moderators[this.lastJoined].push(this.username)),h.isJustinfan(this.getUsername())||this.userstate[s]||(this.userstate[s]=e.tags,this.lastJoined=s,this.channels.push(s),this.log.info("Joined "+s),this.emit("join",s,h.username(this.getUsername()),!0)),e.tags["emote-sets"]!==this.emotes&&this._updateEmoteset(e.tags["emote-sets"]),this.userstate[s]=e.tags;break;case"GLOBALUSERSTATE":this.globaluserstate=e.tags,"undefined"!=typeof e.tags["emote-sets"]&&this._updateEmoteset(e.tags["emote-sets"]);break;case"ROOMSTATE":if(h.channel(this.lastJoined)===h.channel(e.params[0])&&this.emit("_promiseJoin",null),e.tags.channel=h.channel(e.params[0]),this.emit("roomstate",h.channel(e.params[0]),e.tags),!e.tags.hasOwnProperty("subs-only")){if(e.tags.hasOwnProperty("slow"))if("boolean"!=typeof e.tags.slow||e.tags.slow){var J=~~e.tags.slow;this.log.info("["+s+"] This room is now in slow mode."),this.emits(["slow","slowmode","_promiseSlow"],[[s,!0,J],[s,!0,J],[null]])}else this.log.info("["+s+"] This room is no longer in slow mode."),this.emits(["slow","slowmode","_promiseSlowoff"],[[s,!1,0],[s,!1,0],[null]]);if(e.tags.hasOwnProperty("followers-only"))if("-1"===e.tags["followers-only"])this.log.info("["+s+"] This room is no longer in followers-only mode."),this.emits(["followersonly","followersmode","_promiseFollowersoff"],[[s,!1,0],[s,!1,0],[null]]);else{var J=~~e.tags["followers-only"];this.log.info("["+s+"] This room is now in follower-only mode."),this.emits(["followersonly","followersmode","_promiseFollowers"],[[s,!0,J],[s,!0,J],[null]])}}break;default:this.log.warn("Could not parse message from tmi.twitch.tv:\n"+JSON.stringify(e,null,4))}else if("jtv"===e.prefix)switch(e.command){case"MODE":"+o"===n?(this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].includes(e.params[2])||this.moderators[s].push(e.params[2]),this.emit("mod",s,e.params[2])):"-o"===n&&(this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].filter(function(t){return t!=e.params[2]}),this.emit("unmod",s,e.params[2]));break;default:this.log.warn("Could not parse message from jtv:\n"+JSON.stringify(e,null,4))}else switch(e.command){case"353":this.emit("names",e.params[2],e.params[3].split(" "));break;case"366":break;case"JOIN":var H=e.prefix.split("!")[0];h.isJustinfan(this.getUsername())&&this.username===H&&(this.lastJoined=s,this.channels.push(s),this.log.info("Joined "+s),this.emit("join",s,H,!0)),this.username!==H&&this.emit("join",s,H,!1);break;case"PART":var q=!1,H=e.prefix.split("!")[0];if(this.username===H){q=!0,this.userstate[s]&&delete this.userstate[s];var G=this.channels.indexOf(s);-1!==G&&this.channels.splice(G,1);var G=this.opts.channels.indexOf(s);-1!==G&&this.opts.channels.splice(G,1),this.log.info("Left "+s),this.emit("_promisePart",null)}this.emit("part",s,H,q);break;case"WHISPER":var H=e.prefix.split("!")[0];this.log.info("[WHISPER] <"+H+">: "+n),e.tags.hasOwnProperty("username")||(e.tags.username=H),e.tags["message-type"]="whisper";var W=h.channel(e.tags.username);this.emits(["whisper","message"],[[W,e.tags,n,!1]]);break;case"PRIVMSG":if(e.tags.username=e.prefix.split("!")[0],"jtv"===e.tags.username){var V=h.username(n.split(" ")[0]),F=n.includes("auto");if(n.includes("hosting you for")){var z=h.extractNumber(n);this.emit("hosted",s,V,z,F)}else n.includes("hosting you")&&this.emit("hosted",s,V,0,F)}else{var B=h.actionMessage(n);B?(e.tags["message-type"]="action",this.log.info("["+s+"] *<"+e.tags.username+">: "+B[1]),this.emits(["action","message"],[[s,e.tags,B[1],!1]])):e.tags.hasOwnProperty("bits")?this.emit("cheer",s,e.tags,n):(e.tags["message-type"]="chat",this.log.info("["+s+"] <"+e.tags.username+">: "+n),this.emits(["chat","message"],[[s,e.tags,n,!1]]))}break;default:this.log.warn("Could not parse message:\n"+JSON.stringify(e,null,4))}}},m.prototype.connect=function(){var e=this;return new Promise(function(t,s){e.server=h.get(e.opts.connection.server,"irc-ws.chat.twitch.tv"),e.port=h.get(e.opts.connection.port,80),e.secure&&(e.port=443),443===e.port&&(e.secure=!0),e.reconnectTimer=e.reconnectTimer*e.reconnectDecay,e.reconnectTimer>=e.maxReconnectInterval&&(e.reconnectTimer=e.maxReconnectInterval),e._openConnection(),e.once("_promiseConnect",function(n){n?s(n):t([e.server,~~e.port])})})},m.prototype._openConnection=function(){this.ws=new u((this.secure?"wss":"ws")+"://"+this.server+":"+this.port+"/","irc"),this.ws.onmessage=this._onMessage.bind(this),this.ws.onerror=this._onError.bind(this),this.ws.onclose=this._onClose.bind(this),this.ws.onopen=this._onOpen.bind(this)},m.prototype._onOpen=function(){h.isNull(this.ws)||1!==this.ws.readyState||(this.log.info("Connecting to "+this.server+" on port "+this.port+".."),this.emit("connecting",this.server,~~this.port),this.username=h.get(this.opts.identity.username,h.justinfan()),this.password=h.password(h.get(this.opts.identity.password,"SCHMOOPIIE")),this.log.info("Sending authentication to server.."),this.emit("logon"),this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"),this.ws.send("PASS "+this.password),this.ws.send("NICK "+this.username),this.ws.send("USER "+this.username+" 8 * :"+this.username))},m.prototype._onMessage=function(e){var t=this,s=e.data.split("\r\n");s.forEach(function(e){h.isNull(e)||t.handleMessage(a.msg(e))})},m.prototype._onError=function(){var e=this;this.moderators={},this.userstate={},this.globaluserstate={},clearInterval(this.pingLoop),clearTimeout(this.pingTimeout),this.reason=h.isNull(this.ws)?"Connection closed.":"Unable to connect.",this.emits(["_promiseConnect","disconnected"],[[this.reason]]),this.reconnect&&this.reconnections===this.maxReconnectAttempts&&(this.emit("maxreconnect"),this.log.error("Maximum reconnection attempts reached.")),this.reconnect&&!this.reconnecting&&this.reconnections<=this.maxReconnectAttempts-1&&(this.reconnecting=!0,this.reconnections=this.reconnections+1,this.log.error("Reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.emit("reconnect"),setTimeout(function(){e.reconnecting=!1,e.connect()},this.reconnectTimer)),this.ws=null},m.prototype._onClose=function(){var e=this;this.moderators={},this.userstate={},this.globaluserstate={},clearInterval(this.pingLoop),clearTimeout(this.pingTimeout),this.wasCloseCalled?(this.wasCloseCalled=!1,this.reason="Connection closed.",this.log.info(this.reason),this.emits(["_promiseConnect","_promiseDisconnect","disconnected"],[[this.reason],[null],[this.reason]])):(this.emits(["_promiseConnect","disconnected"],[[this.reason]]),this.reconnect&&this.reconnections===this.maxReconnectAttempts&&(this.emit("maxreconnect"),this.log.error("Maximum reconnection attempts reached.")),this.reconnect&&!this.reconnecting&&this.reconnections<=this.maxReconnectAttempts-1&&(this.reconnecting=!0,this.reconnections=this.reconnections+1,this.log.error("Could not connect to server. Reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.emit("reconnect"),setTimeout(function(){e.reconnecting=!1,e.connect()},this.reconnectTimer))),this.ws=null},m.prototype._getPromiseDelay=function(){return this.currentLatency<=600?600:this.currentLatency+100},m.prototype._sendCommand=function(e,t,s,n){var i=this;return new Promise(function(o,r){if(h.promiseDelay(e).then(function(){r("No response from Twitch.")}),h.isNull(i.ws)||2===i.ws.readyState||3===i.ws.readyState)r("Not connected to server.");else{if(h.isNull(t))i.log.info("Executing command: "+s),i.ws.send(s);else{var a=h.channel(t);i.log.info("["+a+"] Executing command: "+s),i.ws.send("PRIVMSG "+a+" :"+s)}n(o,r)}})},m.prototype._sendMessage=function(e,t,s,n){var i=this;return new Promise(function(o,r){if(h.isNull(i.ws)||2===i.ws.readyState||3===i.ws.readyState||h.isJustinfan(i.getUsername()))r("Not connected to server.");else{var c=h.channel(t);if(i.userstate[c]||(i.userstate[c]={}),s.length>=500){var l=h.splitLine(s,500);s=l[0],setTimeout(function(){i._sendMessage(e,t,l[1],function(){})},350)}i.ws.send("PRIVMSG "+c+" :"+s);var u={};Object.keys(i.emotesets).forEach(function(e){i.emotesets[e].forEach(function(e){return h.isRegex(e.code)?a.emoteRegex(s,e.code,e.id,u):void a.emoteString(s,e.code,e.id,u)})});var m=h.merge(i.userstate[c],a.emotes({emotes:a.transformEmotes(u)||null})),f=h.actionMessage(s);f?(m["message-type"]="action",i.log.info("["+c+"] *<"+i.getUsername()+">: "+f[1]),i.emits(["action","message"],[[c,m,f[1],!0]])):(m["message-type"]="chat",i.log.info("["+c+"] <"+i.getUsername()+">: "+s),i.emits(["chat","message"],[[c,m,s,!0]])),n(o,r)}})},m.prototype._updateEmoteset=function(e){var t=this;this.emotes=e,this.api({url:"/chat/emoticon_images?emotesets="+e,headers:{Authorization:"OAuth "+h.password(h.get(this.opts.identity.password,"")).replace("oauth:",""),"Client-ID":this.clientId}},function(s,n,i){return s?void setTimeout(function(){t._updateEmoteset(e)},6e4):(t.emotesets=i.emoticon_sets||{},t.emit("emotesets",e,t.emotesets))})},m.prototype.getUsername=function(){return this.username},m.prototype.getOptions=function(){return this.opts},m.prototype.getChannels=function(){return this.channels},m.prototype.isMod=function(e,t){var s=h.channel(e);return this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].includes(h.username(t))},m.prototype.readyState=function(){return h.isNull(this.ws)?"CLOSED":["CONNECTING","OPEN","CLOSING","CLOSED"][this.ws.readyState]},m.prototype.disconnect=function(){var e=this;return new Promise(function(t,s){h.isNull(e.ws)||3===e.ws.readyState?(e.log.error("Cannot disconnect from server. Socket is not opened or connection is already closing."),s("Cannot disconnect from server. Socket is not opened or connection is already closing.")):(e.wasCloseCalled=!0,e.log.info("Disconnecting from server.."),e.ws.close(),e.once("_promiseDisconnect",function(){t([e.server,~~e.port])}))})},m.prototype.utils=l,"undefined"!=typeof t&&t.exports&&(t.exports=m),"undefined"!=typeof window&&(window.tmi={},window.tmi.client=m,window.tmi.Client=m)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./api":2,"./commands":4,"./events":5,"./extra-utils":6,"./logger":7,"./parser":8,"./timer":9,"./utils":10,ws:11}],4:[function(e,t,s){"use strict";function n(e,t){var s=this;return e=u.channel(e),t=u.get(t,30),this._sendCommand(this._getPromiseDelay(),e,"/followers "+t,function(n,i){s.once("_promiseFollowers",function(s){s?i(s):n([e,~~t])})})}function i(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/followersoff",function(s,n){t.once("_promiseFollowersoff",function(t){t?n(t):s([e])})})}function o(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),null,"PART "+e,function(s,n){t.once("_promisePart",function(t){t?n(t):s([e])})})}function r(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/r9kbeta",function(s,n){t.once("_promiseR9kbeta",function(t){t?n(t):s([e])})})}function a(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/r9kbetaoff",function(s,n){t.once("_promiseR9kbetaoff",function(t){t?n(t):s([e])})})}function c(e,t){var s=this;return e=u.channel(e),t=u.get(t,300),this._sendCommand(this._getPromiseDelay(),e,"/slow "+t,function(n,i){s.once("_promiseSlow",function(s){s?i(s):n([e,~~t])})})}function l(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/slowoff",function(s,n){t.once("_promiseSlowoff",function(t){t?n(t):s([e])})})}var u=e("./utils");t.exports={action:function(e,t){return e=u.channel(e),t="ACTION "+t+"",this._sendMessage(this._getPromiseDelay(),e,t,function(s,n){s([e,t])})},ban:function(e,t,s){var n=this;return e=u.channel(e),t=u.username(t),s=u.get(s,""),this._sendCommand(this._getPromiseDelay(),e,"/ban "+t+" "+s,function(i,o){n.once("_promiseBan",function(n){n?o(n):i([e,t,s])})})},clear:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/clear",function(s,n){t.once("_promiseClear",function(t){t?n(t):s([e])})})},color:function(e,t){var s=this;return t=u.get(t,e),this._sendCommand(this._getPromiseDelay(),"#tmijs","/color "+t,function(e,n){s.once("_promiseColor",function(s){s?n(s):e([t])})})},commercial:function(e,t){var s=this;return e=u.channel(e),t=u.get(t,30),this._sendCommand(this._getPromiseDelay(),e,"/commercial "+t,function(n,i){s.once("_promiseCommercial",function(s){s?i(s):n([e,~~t])})})},deletemessage:function(e,t){var s=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/delete "+t,function(t,n){s.once("_promiseDeletemessage",function(s){s?n(s):t([e])})})},emoteonly:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/emoteonly",function(s,n){t.once("_promiseEmoteonly",function(t){t?n(t):s([e])})})},emoteonlyoff:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/emoteonlyoff",function(s,n){t.once("_promiseEmoteonlyoff",function(t){t?n(t):s([e])})})},followersonly:n,followersmode:n,followersonlyoff:i,followersmodeoff:i,host:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(2e3,e,"/host "+t,function(n,i){s.once("_promiseHost",function(s,o){s?i(s):n([e,t,~~o])})})},join:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),null,"JOIN "+e,function(s,n){t.once("_promiseJoin",function(t){t?n(t):s([e])})})},mod:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/mod "+t,function(n,i){s.once("_promiseMod",function(s){s?i(s):n([e,t])})})},mods:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/mods",function(s,n){t.once("_promiseMods",function(i,o){i?n(i):(o.forEach(function(s){t.moderators[e]||(t.moderators[e]=[]),t.moderators[e].includes(s)||t.moderators[e].push(s)}),s(o))})})},part:o,leave:o,ping:function(){var e=this;return this._sendCommand(this._getPromiseDelay(),null,"PING",function(t,s){e.latency=new Date,e.pingTimeout=setTimeout(function(){null!==e.ws&&(e.wasCloseCalled=!1,e.log.error("Ping timeout."),e.ws.close(),clearInterval(e.pingLoop),clearTimeout(e.pingTimeout))},u.get(e.opts.connection.timeout,9999)),e.once("_promisePing",function(e){t([parseFloat(e)])})})},r9kbeta:r,r9kmode:r,r9kbetaoff:a,r9kmodeoff:a,raw:function(e){return this._sendCommand(this._getPromiseDelay(),null,e,function(t,s){t([e])})},say:function(e,t){return e=u.channel(e),t.startsWith(".")&&!t.startsWith("..")||t.startsWith("/")||t.startsWith("\\")?"me "===t.substr(1,3)?this.action(e,t.substr(4)):this._sendCommand(this._getPromiseDelay(),e,t,function(s,n){s([e,t])}):this._sendMessage(this._getPromiseDelay(),e,t,function(s,n){s([e,t])})},slow:c,slowmode:c,slowoff:l,slowmodeoff:l,subscribers:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/subscribers",function(s,n){t.once("_promiseSubscribers",function(t){t?n(t):s([e])})})},subscribersoff:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/subscribersoff",function(s,n){t.once("_promiseSubscribersoff",function(t){t?n(t):s([e])})})},timeout:function(e,t,s,n){var i=this;return e=u.channel(e),t=u.username(t),u.isNull(s)||u.isInteger(s)||(n=s,s=300),s=u.get(s,300),n=u.get(n,""),this._sendCommand(this._getPromiseDelay(),e,"/timeout "+t+" "+s+" "+n,function(o,r){i.once("_promiseTimeout",function(i){i?r(i):o([e,t,~~s,n])})})},unban:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unban "+t,function(n,i){s.once("_promiseUnban",function(s){s?i(s):n([e,t])})})},unhost:function(e){var t=this;return e=u.channel(e),this._sendCommand(2e3,e,"/unhost",function(s,n){t.once("_promiseUnhost",function(t){t?n(t):s([e])})})},unmod:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unmod "+t,function(n,i){s.once("_promiseUnmod",function(s){s?i(s):n([e,t])})})},unvip:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unvip "+t,function(n,i){s.once("_promiseUnvip",function(s){s?i(s):n([e,t])})})},vip:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/vip "+t,function(n,i){s.once("_promiseVip",function(s){s?i(s):n([e,t])})})},vips:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/vips",function(e,s){t.once("_promiseVips",function(t,n){t?s(t):e(n)})})},whisper:function(e,t){var s=this;return e=u.username(e),e===this.getUsername()?Promise.reject("Cannot send a whisper to the same account."):this._sendCommand(this._getPromiseDelay(),"#tmijs","/w "+e+" "+t,function(n,i){var o=u.channel(e),r=u.merge({"message-type":"whisper","message-id":null,"thread-id":null,username:s.getUsername()
},s.globaluserstate);s.emits(["whisper","message"],[[o,r,t,!0],[o,r,t,!0]]),n([e,t])})}}},{"./utils":10}],5:[function(e,t,s){"use strict";function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function r(e){return"object"===("undefined"==typeof e?"undefined":c(e))&&null!==e}function a(e){return void 0===e}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.indexOf(e,t)===t}),t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emits=function(e,t){for(var s=0;s<e.length;s++){var n=s<t.length?t[s]:t[t.length-1];this.emit.apply(this,[e[s]].concat(n))}},n.prototype.emit=function(e){var t,s,n,o,c,l;if(this._events||(this._events={}),"error"===e&&(!this._events.error||r(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(s=this._events[e],a(s))return!1;if(i(s))switch(arguments.length){case 1:s.call(this);break;case 2:s.call(this,arguments[1]);break;case 3:s.call(this,arguments[1],arguments[2]);break;default:o=Array.prototype.slice.call(arguments,1),s.apply(this,o)}else if(r(s))for(o=Array.prototype.slice.call(arguments,1),l=s.slice(),n=l.length,c=0;n>c;c++)l[c].apply(this,o);return!0},n.prototype.addListener=function(e,t){var s;if(!i(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?r(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,r(this._events[e])&&!this._events[e].warned&&(s=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,s&&s>0&&this._events[e].length>s&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function s(){"_"!==e.charAt(0)||isNaN(e.substr(e.length-1))||(e=e.substring(0,e.length-1)),this.removeListener(e,s),n||(n=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var n=!1;if(this._events.hasOwnProperty(e)&&"_"===e.charAt(0)){var o=1,r=e;for(var a in this._events)this._events.hasOwnProperty(a)&&a.startsWith(r)&&o++;e+=o}return s.listener=t,this.on(e,s),this},n.prototype.removeListener=function(e,t){var s,n,o,a;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(s=this._events[e],o=s.length,n=-1,s===t||i(s.listener)&&s.listener===t){if(delete this._events[e],this._events.hasOwnProperty(e+"2")&&"_"===e.charAt(0)){var c=e;for(var l in this._events)this._events.hasOwnProperty(l)&&l.startsWith(c)&&(isNaN(parseInt(l.substr(l.length-1)))||(this._events[e+parseInt(l.substr(l.length-1)-1)]=this._events[l],delete this._events[l]));this._events[e]=this._events[e+"1"],delete this._events[e+"1"]}this._events.removeListener&&this.emit("removeListener",e,t)}else if(r(s)){for(a=o;a-- >0;)if(s[a]===t||s[a].listener&&s[a].listener===t){n=a;break}if(0>n)return this;1===s.length?(s.length=0,delete this._events[e]):s.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,s;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(s=this._events[e],i(s))this.removeListener(e,s);else if(s)for(;s.length;)this.removeListener(e,s[s.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(i(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},{}],6:[function(e,t,s){"use strict";var n=e("./utils");t.exports={levenshtein:function(e,t,s){var i=1,o=1,r=1;if(s=n.get(s,!1),s||(e=e.toLowerCase(),t=t.toLowerCase()),e==t)return 0;var a=e.length,c=t.length;if(0===a)return c*i;if(0===c)return a*r;var l=!1;try{l=!"0"[0]}catch(u){l=!0}l&&(e=e.split(""),t=t.split(""));var h,m,f,p,d,g,_=new Array(c+1),b=new Array(c+1);for(m=0;c>=m;m++)_[m]=m*i;for(h=0;a>h;h++){for(b[0]=_[0]+r,m=0;c>m;m++)f=_[m]+(e[h]==t[m]?0:o),p=_[m+1]+r,f>p&&(f=p),d=b[m]+i,f>d&&(f=d),b[m+1]=f;g=_,_=b,b=g}return f=_[c]},raffle:{init:function(e){this.raffleChannels||(this.raffleChannels={}),this.raffleChannels[n.channel(e)]||(this.raffleChannels[n.channel(e)]=[])},enter:function(e,t){this.init(e),this.raffleChannels[n.channel(e)].push(t.toLowerCase())},leave:function(e,t){this.init(e);var s=this.raffleChannels[n.channel(e)].indexOf(n.username(t));return s>=0?(this.raffleChannels[n.channel(e)].splice(s,1),!0):!1},pick:function(e){this.init(e);var t=this.raffleChannels[n.channel(e)].length;return t>=1?this.raffleChannels[n.channel(e)][Math.floor(Math.random()*t)]:null},reset:function(e){this.init(e),this.raffleChannels[n.channel(e)]=[]},count:function(e){return this.init(e),this.raffleChannels[n.channel(e)]?this.raffleChannels[n.channel(e)].length:0},isParticipating:function(e,t){return this.init(e),this.raffleChannels[n.channel(e)].includes(n.username(t))}},symbols:function(e){for(var t=0,s=0;s<e.length;s++){var n=e.substring(s,s+1).charCodeAt(0);(30>=n||n>=127||65533===n)&&t++}return Math.ceil(t/e.length*100)/100},uppercase:function(e){var t=e.length,s=e.match(/[A-Z]/g);return n.isNull(s)?0:s.length/t}}},{"./utils":10}],7:[function(e,t,s){"use strict";function n(e){return function(t){r[e]>=r[o]&&console.log("["+i.formatDate(new Date)+"] "+e+": "+t)}}var i=e("./utils"),o="info",r={trace:0,debug:1,info:2,warn:3,error:4,fatal:5};t.exports={setLevel:function(e){o=e},trace:n("trace"),debug:n("debug"),info:n("info"),warn:n("warn"),error:n("error"),fatal:n("fatal")}},{"./utils":10}],8:[function(e,t,s){"use strict";var n=e("./utils");t.exports={badges:function i(e){if(n.isString(e.badges)){for(var i={},t=e.badges.split(","),s=0;s<t.length;s++){var o=t[s].split("/");if(!o[1])return;i[o[0]]=o[1]}e["badges-raw"]=e.badges,e.badges=i}return n.isBoolean(e.badges)&&(e["badges-raw"]=null),e},emotes:function o(e){if(n.isString(e.emotes)){for(var t=e.emotes.split("/"),o={},s=0;s<t.length;s++){var i=t[s].split(":");if(!i[1])return;o[i[0]]=i[1].split(",")}e["emotes-raw"]=e.emotes,e.emotes=o}return n.isBoolean(e.emotes)&&(e["emotes-raw"]=null),e},emoteRegex:function(e,t,s,i){for(var o,r=/\S+/g,a=new RegExp("(\\b|^|s)"+n.unescapeHtml(t)+"(\\b|$|s)");null!==(o=r.exec(e));)a.test(o[0])&&(i[s]=i[s]||[],i[s].push([o.index,r.lastIndex-1]))},emoteString:function(e,t,s,i){for(var o,r=/\S+/g;null!==(o=r.exec(e));)o[0]===n.unescapeHtml(t)&&(i[s]=i[s]||[],i[s].push([o.index,r.lastIndex-1]))},transformEmotes:function(e){var t="";return Object.keys(e).forEach(function(s){t=t+s+":",e[s].forEach(function(e){t=t+e.join("-")+","}),t=t.slice(0,-1)+"/"}),t.slice(0,-1)},msg:function(e){var t={raw:e,tags:{},prefix:null,command:null,params:[]},s=0,n=0;if(64===e.charCodeAt(0)){var n=e.indexOf(" ");if(-1===n)return null;for(var i=e.slice(1,n).split(";"),o=0;o<i.length;o++){var r=i[o],a=r.split("=");t.tags[a[0]]=r.substring(r.indexOf("=")+1)||!0}s=n+1}for(;32===e.charCodeAt(s);)s++;if(58===e.charCodeAt(s)){if(n=e.indexOf(" ",s),-1===n)return null;for(t.prefix=e.slice(s+1,n),s=n+1;32===e.charCodeAt(s);)s++}if(n=e.indexOf(" ",s),-1===n)return e.length>s?(t.command=e.slice(s),t):null;for(t.command=e.slice(s,n),s=n+1;32===e.charCodeAt(s);)s++;for(;s<e.length;){if(n=e.indexOf(" ",s),58===e.charCodeAt(s)){t.params.push(e.slice(s+1));break}if(-1===n){if(-1===n){t.params.push(e.slice(s));break}}else for(t.params.push(e.slice(s,n)),s=n+1;32===e.charCodeAt(s);)s++}return t}}},{"./utils":10}],9:[function(e,t,s){"use strict";function n(e){this.queue=[],this.index=0,this.defaultDelay=e||3e3}n.prototype.add=function(e,t){this.queue.push({fn:e,delay:t})},n.prototype.run=function(e){(e||0===e)&&(this.index=e),this.next()},n.prototype.next=function i(){var e=this,t=this.index++,s=this.queue[t],i=this.queue[this.index];s&&(s.fn(),i&&setTimeout(function(){e.next()},i.delay||this.defaultDelay))},n.prototype.reset=function(){this.index=0},n.prototype.clear=function(){this.index=0,this.queue=[]},s.queue=n},{}],10:[function(e,t,s){(function(e){"use strict";var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=/^\u0001ACTION ([^\u0001]+)\u0001$/,i=/^(justinfan)(\d+$)/,o=/\\([sn:r\\])/g,r={s:" ",n:"",":":";",r:""},a=t.exports={get:function(e,t){return"undefined"==typeof e?t:e},isBoolean:function(e){return"boolean"==typeof e},isFinite:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return isFinite(e)&&!isNaN(parseFloat(e))}),isInteger:function(e){return!isNaN(a.toNumber(e,0))},isJustinfan:function(e){return i.test(e)},isNull:function(e){return null===e},isRegex:function(e){return/[\|\\\^\$\*\+\?\:\#]/.test(e)},isString:function(e){return"string"==typeof e},isURL:function(e){return RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$","i").test(e)},justinfan:function(){return"justinfan"+Math.floor(8e4*Math.random()+1e3)},password:function(e){return["SCHMOOPIIE","",null].includes(e)?"SCHMOOPIIE":"oauth:"+e.toLowerCase().replace("oauth:","")},promiseDelay:function(e){return new Promise(function(t){setTimeout(t,e)})},replaceAll:function(e,t){if(null===e||"undefined"==typeof e)return null;for(var s in t)e=e.replace(new RegExp(s,"g"),t[s]);return e},unescapeHtml:function(e){return e.replace(/\\&amp\\;/g,"&").replace(/\\&lt\\;/g,"<").replace(/\\&gt\\;/g,">").replace(/\\&quot\\;/g,'"').replace(/\\&#039\\;/g,"'")},unescapeIRC:function(e){return e&&e.includes("\\")?e.replace(o,function(e,t){return t in r?r[t]:t}):e},actionMessage:function(e){return e.match(n)},addWord:function(e,t){return e.length?e+" "+t:e+t},channel:function c(e){var c=(e?e:"").toLowerCase();return"#"===c[0]?c:"#"+c},extractNumber:function(e){for(var t=e.split(" "),s=0;s<t.length;s++)if(a.isInteger(t[s]))return~~t[s];return 0},formatDate:function(e){var t=e.getHours(),s=e.getMinutes();return t=(10>t?"0":"")+t,s=(10>s?"0":"")+s,t+":"+s},inherits:function(e,t){e.super_=t;var s=function(){};s.prototype=t.prototype,e.prototype=new s,e.prototype.constructor=e},isNode:function(){try{return t.exports="object"===("undefined"==typeof e?"undefined":s(e))&&"[object process]"===Object.prototype.toString.call(e)}catch(n){return!1}},isExtension:function(){try{return!!(window.chrome&&chrome.runtime&&chrome.runtime.id)}catch(e){return!1}},merge:Object.assign,splitLine:function(e,t){var s=e.substring(0,t).lastIndexOf(" ");return-1===s&&(s=t-1),[e.substring(0,s),e.substring(s+1)]},toNumber:function(e,t){if(null===e)return 0;var s=Math.pow(10,a.isFinite(t)?t:0);return Math.round(e*s)/s},union:function(e,t){for(var s={},n=[],i=0;i<e.length;i++){var o=e[i];s[o]||(s[o]=!0,n.push(o))}for(var i=0;i<t.length;i++){var o=t[i];s[o]||(s[o]=!0,n.push(o))}return n},username:function l(e){var l=(e?e:"").toLowerCase();return"#"===l[0]?l.slice(1):l}}}).call(this,e("_process"))},{_process:12}],11:[function(e,t,s){"use strict"},{}],12:[function(e,t,s){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(h===setTimeout)return setTimeout(e,0);if((h===n||!h)&&setTimeout)return h=setTimeout,setTimeout(e,0);try{return h(e,0)}catch(t){try{return h.call(null,e,0)}catch(t){return h.call(this,e,0)}}}function r(e){if(m===clearTimeout)return clearTimeout(e);if((m===i||!m)&&clearTimeout)return m=clearTimeout,clearTimeout(e);try{return m(e)}catch(t){try{return m.call(null,e)}catch(t){return m.call(this,e)}}}function a(){g&&p&&(g=!1,p.length?d=p.concat(d):_=-1,d.length&&c())}function c(){if(!g){var e=o(a);g=!0;for(var t=d.length;t;){for(p=d,d=[];++_<t;)p&&p[_].run();_=-1,t=d.length}p=null,g=!1,r(e)}}function l(e,t){this.fun=e,this.array=t}function u(){}var h,m,f=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:n}catch(e){h=n}try{m="function"==typeof clearTimeout?clearTimeout:i}catch(e){m=i}}();var p,d=[],g=!1,_=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var s=1;s<arguments.length;s++)t[s-1]=arguments[s];d.push(new l(e,t)),1!==d.length||g||o(c)},l.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.prependListener=u,f.prependOnceListener=u,f.listeners=function(e){return[]},f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}]},{},[1]);

},{}],"node_modules/node-fetch/browser.js":[function(require,module,exports) {

"use strict"; // ref: https://github.com/tc39/proposal-global

var getGlobal = function () {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('unable to locate global object');
};

var global = getGlobal();
module.exports = exports = global.fetch; // Needed for TypeScript and Webpack.

if (global.fetch) {
  exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
},{}],"node_modules/ws/browser.js":[function(require,module,exports) {
'use strict';

module.exports = function() {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}],"node_modules/comfy.js/app.js":[function(require,module,exports) {
// Comfy.JS v@VERSION
var tmi = require( "tmi.js" );
var fetch = require( "node-fetch" );
var NodeSocket = require( "ws" );

// User and global timestamp store
var timestamps = {
  global: {},
  users: {},
}

// Returns an object containing the time period since last user interaction, and last interaction from any user in `ms`.
//
// # Examples
//
// let userId = 1;
// let last = getTimePeriod(userId);
// console.log(last.any);   // print the time period since last user interacted with the commands, in ms
// console.log(last.user);  // print the time period since this user interacted with the commands, in ms; if `userId` is
//                          // is null or undefined, the field will be `null` as well.
var getTimePeriod = function( command, userId ) {
  if( !command ) {
    return {
      any: null,
      user: null,
    }
  }

  var now = new Date();
  var res = {};

  if( !timestamps.global[command] ) {
    res["any"] = 0;
  } else {
    res["any"] = now - timestamps.global[command];
  }

  // update the global since-last timestamp
  timestamps.global[command] = now;

  // store and update global since-last timestamp
  if( userId ) {
    if( !timestamps.users[userId]) {
      timestamps.users[userId] = {};
    }

    if( !timestamps.users[userId][command] ) {
      res["user"] = 0;
    } else {
      res["user"] = now - timestamps.users[userId][command];
    }

    timestamps.users[userId][command] = now
  } else {
    res["user"] = null;
  }

  return res
}

// Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
function nonce( length ) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function pubsubConnect( channel, password ) {
	const heartbeatInterval = 1000 * 60; //ms between PING's
	const reconnectInterval = 1000 * 3; //ms to wait before reconnect
	let heartbeatHandle;

	password = password.replace( "oauth:", "" );

	let validation = await fetch( "https://id.twitch.tv/oauth2/validate", {
		headers: {
			"Authorization": `OAuth ${password}`
		}
	}).then( r => r.json() );

	if( !validation.client_id || !validation.scopes.includes( "channel:read:redemptions" ) || !validation.scopes.includes( "user:read:email" ) ) {
		console.error( "Invalid Password or Permission Scopes (channel:read:redemptions, user:read:email)" );
		return;
	}

	let userInfo = await fetch( "https://api.twitch.tv/helix/users?login=" + channel, {
		headers: {
			"Client-ID": validation.client_id,
			"Authorization": `Bearer ${password}`
		}
	}).then( r => r.json() );
	let channelId = userInfo.data[ 0 ].id;

	let ws;
	if( typeof window !== "undefined" ) {
		ws = new WebSocket( "wss://pubsub-edge.twitch.tv" );
	}
	else {
		ws = new NodeSocket( "wss://pubsub-edge.twitch.tv" );
	}
	ws.onopen = function( event ) {
		ws.send( JSON.stringify( { type: 'PING' } ) );
        heartbeatHandle = setInterval( () => {
			ws.send( JSON.stringify( { type: 'PING' } ) );
		}, heartbeatInterval );

		// Listen to channel points topic
		let message = {
	        type: "LISTEN",
	        nonce: nonce( 15 ),
	        data: {
	            topics: [ `channel-points-channel-v1.${channelId}` ],
	            auth_token: password
	        }
	    };
		ws.send( JSON.stringify( message ) );
    };
    ws.onerror = function( error ) {
		console.error( error );
    };
    ws.onmessage = function( event ) {
        message = JSON.parse( event.data );
		switch( message.type ) {
			case "RESPONSE":
				if( message.error === "ERR_BADAUTH" ) {
					console.error( "PubSub Authentication Failure" );
				}
				break;
			case "RECONNECT":
	            setTimeout( () => {
					pubsubConnect( channel, password )
				}, reconnectInterval );
				break;
			case "MESSAGE":
				if( message.data.topic.startsWith( "channel-points-channel" ) ) {
					let messageData = JSON.parse( message.data.message );
					if( messageData.type === "reward-redeemed" ) {
						let redemption = messageData.data.redemption;
						// console.log( redemption );
						var extra = {
				          channelId: redemption.channel_id,
				          reward: redemption.reward,
				          rewardFulfilled: redemption.status === "FULFILLED",
				          userId: redemption.user.id,
				          username: redemption.user.login,
				          displayName: redemption.user.display_name,
				          customRewardId: redemption.id,
				          timestamp: redemption.redeemed_at,
				        };
						comfyJS.onReward(
							redemption.user.display_name || redemption.user.login,
							redemption.reward.title,
							redemption.reward.cost,
                            redemption.user_input || "",
							extra
						);
					}
					// console.log( messageData );
				}
				break;
		}
    };
    ws.onclose = function() {
        clearInterval( heartbeatHandle );
        setTimeout( () => {
			pubsubConnect( channel, password )
		}, reconnectInterval );
    };
}

var mainChannel = "";
var client = null;
var isFirstConnect = true;
var reconnectCount = 0;
var comfyJS = {
  isDebug: false,
  chatModes: {},
  version: function() {
    return "@VERSION";
  },
  onError: function( error ) {
    console.error( "Error:", error );
  },
  onCommand: function( user, command, message, flags, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onCommand default handler" );
    }
  },
  onChat: function( user, message, flags, self, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onChat default handler" );
    }
  },
  onWhisper: function( user, message, flags, self, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onWhisper default handler" );
    }
  },
  onMessageDeleted: function( id, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onMessageDeleted default handler" );
    }
  },
  onJoin: function( user, self, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onJoin default handler" );
    }
  },
  onPart: function( user, self, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onPart default handler" );
    }
  },
  onHosted: function( user, viewers, autohost, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onHosted default handler" );
    }
  },
  onRaid: function( user, viewers, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onRaid default handler" );
    }
  },
  onSub: function( user, message, subTierInfo, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onSub default handler" );
    }
  },
  onResub: function( user, message, streakMonths, cumulativeMonths, subTierInfo, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onResub default handler" );
    }
  },
  onSubGift: function( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onSubGift default handler" );
    }
  },
  onSubMysteryGift: function( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onSubMysteryGift default handler" );
    }
  },
  onGiftSubContinue: function( user, sender, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onGiftSubContinue default handler" );
    }
  },
  onCheer: function( message, bits, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onCheer default handler" );
    }
  },
  onChatMode: function( flags, channel ) {
    if( comfyJS.isDebug ) {
      console.log( "onChatMode default handler" );
    }
  },
  onReward: function( user, reward, cost, message, extra ) {
    if( comfyJS.isDebug ) {
      console.log( "onReward default handler" );
    }
  },
  onConnected: function( address, port, isFirstConnect ) {
  },
  onReconnect: function( reconnectCount ) {
  },
  Say: function( message, channel ) {
    if( client ) {
      if( !channel ) {
        channel = mainChannel;
      }
      client.say( channel, message )
      .catch( comfyJS.onError );
      return true;
    }
    return false;
  },
  Whisper: function( message, user ) {
    if( client ) {
      client.whisper( user, message )
      .catch( comfyJS.onError );
      return true;
    }
    return false;
  },
  DeleteMessage: function( id, channel ) {
    if( client ) {
      if( !channel ) {
        channel = mainChannel;
      }
      client.deletemessage( channel, id )
      .catch( comfyJS.onError );
      return true;
    }
    return false;
  },
  GetClient: function() {
    return client;
  },
  Init: function( username, password, channels, isDebug ) {
    channels = channels || [ username ];
    if( typeof channels === 'string' || channels instanceof String ) {
      channels = [ channels ];
    }
    if( !Array.isArray( channels ) ) {
      throw new Error( "Channels is not an array" );
    }
    comfyJS.isDebug = isDebug;
    mainChannel = channels[ 0 ];
    var options = {
      options: {
        debug: isDebug
      },
      connection: {
        reconnect: true,
        secure: true
      },
      channels: channels
    };
    if( password ) {
      options.identity = {
        username: username,
        password: password
      };
    }

    client = new tmi.client( options );
    client.on( 'roomstate', function( channel, state ) {
      try {
        var channelName = channel.replace( "#", "" );
        comfyJS.chatModes[ channelName ] = comfyJS.chatModes[ channelName ] || {};
        if( "emote-only" in state ) { comfyJS.chatModes[ channelName ].emoteOnly = state[ "emote-only" ]; }
        if( "followers-only" in state ) { comfyJS.chatModes[ channelName ].followerOnly = ( state[ "followers-only" ] >= 0 ); }
        if( "subs-only" in state ) { comfyJS.chatModes[ channelName ].subOnly = state[ "subs-only" ]; }
        if( "r9k" in state ) { comfyJS.chatModes[ channelName ].r9kMode = state[ "r9k" ]; }
        if( "slow" in state ) { comfyJS.chatModes[ channelName ].slowMode = state[ "slow" ]; }
        comfyJS.onChatMode( comfyJS.chatModes[ channelName ], channelName );
      }
      catch( error ) {
        comfyJS.onError( error );
      }
    });
    client.on( 'message', function( channel, userstate, message, self ) {
      try {
        var user = userstate[ "display-name" ] || userstate[ "username" ] || username;
        var isBroadcaster = ( "#" + userstate[ "username" ] ) === channel;
        var isMod = userstate[ "mod" ];
        var isFounder = ( userstate[ "badges" ] && userstate[ "badges" ].founder === "0" )
        var isSubscriber = isFounder || ( userstate[ "badges" ] && typeof userstate[ "badges" ].subscriber !== "undefined" ) || userstate[ "subscriber" ];
        var isVIP = ( userstate[ "badges" ] && userstate[ "badges" ].vip === "1" ) || false;
        var isHighlightedMessage = userstate[ "msg-id" ] === "highlighted-message";
        var userId = userstate[ "user-id" ];
        var messageId = userstate[ "id" ];
        var roomId = userstate[ "room-id" ];
        var badges = userstate[ "badges" ];
        var userColor = userstate[ "color" ];
        var emotes = userstate[ "emotes" ];
        var messageFlags = userstate[ "flags" ];
        var messageTimestamp = userstate[ "tmi-sent-ts" ];
        var isEmoteOnly = userstate[ "emote-only" ] || false;
        var messageType = userstate[ "message-type" ];
        var customRewardId = userstate[ "custom-reward-id" ] || null;
        var flags = {
          broadcaster: isBroadcaster,
          mod: isMod,
          founder: isFounder,
          subscriber: isSubscriber || isFounder,
          vip: isVIP,
          highlighted: isHighlightedMessage,
          customReward: !!customRewardId
        };
        var extra = {
          id: messageId,
          channel: channel.replace('#', ''),
          roomId: roomId,
          messageType: messageType,
          messageEmotes: emotes,
          isEmoteOnly: isEmoteOnly,
          userId: userId,
          username: userstate[ "username" ],
          displayName: userstate[ "display-name" ],
          userColor: userColor,
          userBadges: badges,
          customRewardId: customRewardId,
          flags: messageFlags,
          timestamp: messageTimestamp,
        };
        if( !self && message[ 0 ] === "!" ) {
          // Message is a command
          var parts = message.split( / (.*)/ );
          var command = parts[ 0 ].slice( 1 ).toLowerCase();
          var msg = parts[ 1 ] || "";
          extra["sinceLastCommand"] = getTimePeriod( command, userId );
          comfyJS.onCommand( user, command, msg, flags, extra );
        }
        else {
          if( messageType === "action" || messageType === "chat" ) {
            comfyJS.onChat( user, message, flags, self, extra );
          }
          else if( messageType === "whisper" ) {
            comfyJS.onWhisper( user, message, flags, self, extra );
          }
        }
      }
      catch( error ) {
        comfyJS.onError( error );
      }
    });
    client.on( 'messagedeleted', function( channel, username, deletedMessage, userstate ) {
      try {
        var messageId = userstate[ "target-msg-id" ];
        var roomId = userstate[ "room-id" ];
        var extra = {
            id: messageId,
            roomId: roomId,
            username: username,
            message: deletedMessage
        };
        comfyJS.onMessageDeleted( messageId, extra );
      }
      catch( error ) {
        comfyJS.onError( error );
      }
    });
    client.on( 'join', function( channel, username, self ) {
      var extra = {
        channel: channel.replace('#', ''),
      };
      comfyJS.onJoin( username, self, extra );
    });
    client.on( 'part', function( channel, username, self ) {
      var extra = {
        channel: channel.replace('#', ''),
      };
      comfyJS.onPart( username, self, extra );
    });
    client.on( 'hosted', function( channel, username, viewers, autohost ) {
      var extra = {
        channel: channel.replace('#', ''),
      };
      comfyJS.onHosted( username, viewers, autohost, extra );
    });
    client.on( 'raided', function( channel, username, viewers ) {
      var extra = {
        channel: channel.replace('#', ''),
      };
      comfyJS.onRaid( username, viewers, extra );
    });
    client.on( 'cheer', function( channel, userstate, message ) {
      var bits = ~~userstate['bits'];
      var roomId = userstate[ "room-id" ];
      var user = userstate[ "display-name" ] || userstate[ "username" ] || userstate[ "login" ];
      var userId = userstate[ "user-id" ];
      var isBroadcaster = ( "#" + userstate[ "username" ] ) === channel;
      var isMod = userstate[ "mod" ];
      var isFounder = ( userstate[ "badges" ] && userstate[ "badges" ].founder === "0" )
      var isSubscriber = isFounder || ( userstate[ "badges" ] && typeof userstate[ "badges" ].subscriber !== "undefined" ) || userstate[ "subscriber" ];
      var isVIP = ( userstate[ "badges" ] && userstate[ "badges" ].vip === "1" ) || false;
      var flags = {
        broadcaster: isBroadcaster,
        mod: isMod,
        founder: isFounder,
        subscriber: isSubscriber,
        vip: isVIP
      };
      var extra = {
        id: userstate['id'],
        channel: channel.replace('#', ''),
        roomId: roomId,
        userId: userId,
        username: userstate[ 'username' ],
        userColor: userstate['color'],
        userBadges: userstate['badges'],
        displayName: userstate[ 'display-name' ],
        messageEmotes: userstate['emotes'],
        subscriber: userstate['subscriber'],
      };

      comfyJS.onCheer( user, message, bits, flags, extra );
    });
    client.on( 'subscription', function( channel, username, methods, message, userstate ) {
      var extra = {
        id: userstate['id'],
        roomId: userstate['room-id'],
        messageType: userstate['message-type'],
        messageEmotes: userstate['emotes'],
        userId: userstate['user-id'],
        username: userstate[ 'login' ],
        displayName: userstate[ 'display-name' ],
        userColor: userstate['color'],
        userBadges: userstate['badges']
      };

      comfyJS.onSub( username, message, methods, extra );
    });
    client.on( 'resub', function( channel, username, streakMonths, message, userstate, methods ) {
      var cumulativeMonths = ~~userstate[ 'msg-param-cumulative-months' ];
      var extra = {
        id: userstate['id'],
        roomId: userstate['room-id'],
        messageType: userstate['message-type'],
        messageEmotes: userstate['emotes'],
        userId: userstate['user-id'],
        username: userstate[ 'login' ],
        displayName: userstate[ 'display-name' ],
        userColor: userstate['color'],
        userBadges: userstate['badges']
      };

      comfyJS.onResub( username, message, streakMonths, cumulativeMonths, methods, extra );
    });
    client.on( 'subgift', function( channel, gifterUser, streakMonths, recipientUser, methods, userstate ) {
      var senderCount = ~~userstate[ 'msg-param-sender-count' ];
      var extra = {
        id: userstate['id'],
        roomId: userstate['room-id'],
        messageType: userstate['message-type'],
        messageEmotes: userstate['emotes'],
        userId: userstate['user-id'],
        username: userstate[ 'login' ],
        displayName: userstate[ 'display-name' ],
        userColor: userstate['color'],
        userBadges: userstate['badges'],
        recipientDisplayName: userstate["msg-param-recipient-display-name"],
        recipientUsername: userstate["msg-param-recipient-user-name"],
        recipientId: userstate["msg-param-recipient-id"]
      };

      comfyJS.onSubGift( gifterUser, streakMonths, recipientUser, senderCount, methods, extra );
    });
    client.on( 'submysterygift', function( channel, gifterUser, numbOfSubs, methods, userstate ) {
      var senderCount = ~~userstate[ 'msg-param-sender-count' ];

      var extra = {
        id: userstate['id'],
        roomId: userstate['room-id'],
        messageType: userstate['message-type'],
        messageEmotes: userstate['emotes'],
        userId: userstate['user-id'],
        username: userstate[ 'login' ],
        displayName: userstate[ 'display-name' ],
        userColor: userstate['color'],
        userBadges: userstate['badges'],
        recipientDisplayName: userstate["msg-param-recipient-display-name"],
        recipientUsername: userstate["msg-param-recipient-user-name"],
        recipientId: userstate["msg-param-recipient-id"],
        userMassGiftCount: ~~userstate[ 'msg-param-mass-gift-count' ]
      };

      comfyJS.onSubMysteryGift( gifterUser, numbOfSubs, senderCount, methods, extra );
    });
    client.on( 'giftpaidupgrade', function( channel, username, sender, userstate ) {
      var extra = {
        id: userstate['id'],
        roomId: userstate['room-id'],
        messageType: userstate['message-type'],
        messageEmotes: userstate['emotes'],
        userId: userstate['user-id'],
        username: userstate[ 'login' ],
        displayName: userstate[ 'display-name' ],
        userColor: userstate['color'],
        userBadges: userstate['badges'],
        gifterUsername: userstate['msg-param-sender-login'],
        gifterDisplayName: userstate['msg-param-sender-name']
      };

      comfyJS.onGiftSubContinue( username, sender, extra);
    });
    client.on( 'connected', function( address, port ) {
      console.log( 'Connected:' + address + ':' + port );
      comfyJS.onConnected( address, port, isFirstConnect );
      isFirstConnect = false;
    });
    client.on( 'reconnect', function() {
      console.log( 'Reconnecting' );
      reconnectCount++;
      comfyJS.onReconnect( reconnectCount );
    });
    client.connect()
    .catch( comfyJS.onError );

	// Setup PubSub (https://github.com/twitchdev/pubsub-javascript-sample)
	if( password ) {
		pubsubConnect( mainChannel, password );
	}
  },
  Disconnect: function() {
    client.disconnect()
    .catch( comfyJS.onError );
  }
};

// Expose everything, for browser and Node..
if (typeof module !== "undefined" && module.exports) {
    module.exports = comfyJS;
}

if (typeof window !== "undefined") {
    window.ComfyJS = comfyJS;
    tmi = window.tmi;
}

},{"tmi.js":"node_modules/comfy.js/vendor/tmi.min.js","node-fetch":"node_modules/node-fetch/browser.js","ws":"node_modules/ws/browser.js"}],"node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],"../../.config/yarn/global/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    var errorListener; // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.

    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}
},{}],"node_modules/queue/index.js":[function(require,module,exports) {
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter

module.exports = Queue
module.exports.default = Queue

function Queue (options) {
  if (!(this instanceof Queue)) {
    return new Queue(options)
  }

  EventEmitter.call(this)
  options = options || {}
  this.concurrency = options.concurrency || Infinity
  this.timeout = options.timeout || 0
  this.autostart = options.autostart || false
  this.results = options.results || null
  this.pending = 0
  this.session = 0
  this.running = false
  this.jobs = []
  this.timers = {}
}
inherits(Queue, EventEmitter)

var arrayMethods = [
  'pop',
  'shift',
  'indexOf',
  'lastIndexOf'
]

arrayMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    return Array.prototype[method].apply(this.jobs, arguments)
  }
})

Queue.prototype.slice = function (begin, end) {
  this.jobs = this.jobs.slice(begin, end)
  return this
}

Queue.prototype.reverse = function () {
  this.jobs.reverse()
  return this
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
]

arrayAddMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments)
    if (this.autostart) {
      this.start()
    }
    return methodResult
  }
})

Object.defineProperty(Queue.prototype, 'length', {
  get: function () {
    return this.pending + this.jobs.length
  }
})

Queue.prototype.start = function (cb) {
  if (cb) {
    callOnErrorOrEnd.call(this, cb)
  }

  this.running = true

  if (this.pending >= this.concurrency) {
    return
  }

  if (this.jobs.length === 0) {
    if (this.pending === 0) {
      done.call(this)
    }
    return
  }

  var self = this
  var job = this.jobs.shift()
  var once = true
  var session = this.session
  var timeoutId = null
  var didTimeout = false
  var resultIndex = null
  var timeout = job.timeout || this.timeout

  function next (err, result) {
    if (once && self.session === session) {
      once = false
      self.pending--
      if (timeoutId !== null) {
        delete self.timers[timeoutId]
        clearTimeout(timeoutId)
      }

      if (err) {
        self.emit('error', err, job)
      } else if (didTimeout === false) {
        if (resultIndex !== null) {
          self.results[resultIndex] = Array.prototype.slice.call(arguments, 1)
        }
        self.emit('success', result, job)
      }

      if (self.session === session) {
        if (self.pending === 0 && self.jobs.length === 0) {
          done.call(self)
        } else if (self.running) {
          self.start()
        }
      }
    }
  }

  if (timeout) {
    timeoutId = setTimeout(function () {
      didTimeout = true
      if (self.listeners('timeout').length > 0) {
        self.emit('timeout', next, job)
      } else {
        next()
      }
    }, timeout)
    this.timers[timeoutId] = timeoutId
  }

  if (this.results) {
    resultIndex = this.results.length
    this.results[resultIndex] = null
  }

  this.pending++
  self.emit('start', job)
  var promise = job(next)
  if (promise && promise.then && typeof promise.then === 'function') {
    promise.then(function (result) {
      return next(null, result)
    }).catch(function (err) {
      return next(err || true)
    })
  }

  if (this.running && this.jobs.length > 0) {
    this.start()
  }
}

Queue.prototype.stop = function () {
  this.running = false
}

Queue.prototype.end = function (err) {
  clearTimers.call(this)
  this.jobs.length = 0
  this.pending = 0
  done.call(this, err)
}

function clearTimers () {
  for (var key in this.timers) {
    var timeoutId = this.timers[key]
    delete this.timers[key]
    clearTimeout(timeoutId)
  }
}

function callOnErrorOrEnd (cb) {
  var self = this
  this.on('error', onerror)
  this.on('end', onend)

  function onerror (err) { self.end(err) }
  function onend (err) {
    self.removeListener('error', onerror)
    self.removeListener('end', onend)
    cb(err, this.results)
  }
}

function done (err) {
  this.session++
  this.running = false
  this.emit('end', err)
}

},{"inherits":"node_modules/inherits/inherits_browser.js","events":"../../.config/yarn/global/node_modules/events/events.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _queue = _interopRequireDefault(require("queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ComfyJS = require('comfy.js');

const PAUZE_DURATION = 30 * 1000;
const DISPLAY_DURATION = 10 * 1000;
const alertContainer = document.querySelector('.alert-container');
const queue = new _queue.default(); // Sounds

const hello = new Audio('/sounds/hello.mp3');
const myMan = new Audio('/sounds/myman.mp3');
const veryNice = new Audio('/sounds/verynice.mp3'); // Gifs

const helloGif = '/gifs/hello.gif';
const myManGif = '/gifs/myman.gif';
const veryNiceGif = '/gifs/verynice.gif';

const wait = async duration => {
  return new Promise(resolve => setTimeout(resolve, duration));
}; // All chatbot commands here!


ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if (command === 'lurk') {
    ComfyJS.Say(`@${user} Thanks for the lurk!`);
  }

  if (command === 'lurkoff') {
    ComfyJS.Say(`@${user} Welcome back!`);
  }

  if (command === 'streamergoods') {
    ComfyJS.Say('https://www.streamergoods.com');
  }

  if (command === 'website') {
    ComfyJS.Say('https://www.stijnelskens.com');
    new alert(user, myManGif, myMan, command);
  }
};

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
  ComfyJS.Say(`Thanks for the sub! @${user}`);
  new alert(user, myManGif, myMan, onSub);
};

ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
  ComfyJS.Say(`Thanks for the resub! @${user}`);
  new alert(user, myManGif, myMan, onReSub, streamMonths);
};

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
  new alert(gifterUser, myManGif, myMan, onSubGift, recipientUser);
};

ComfyJS.onCheer = (user, message, bits, flags, extra) => {
  new alert(user, veryNiceGif, veryNice, bits);
};

ComfyJS.onRaid = (user, viewers, extra) => {
  ComfyJS.Say(`Thanks for the raid. @${user} with ${viewers} viewers.`); // new alert(user,);
};

ComfyJS.onHosted = (user, viewers, autohost, extra) => {
  ComfyJS.Say(`Thanks for the raid. @${user} with ${viewers} viewers.`); // new alert(user,);
};

ComfyJS.Init("laks_1", "oauth:z3t7lrxhv8haksx4o801l2cn5szm8e");
const generateTitle = {
  onSub: " subscribed!",
  onReSub: " resubscribed!",
  onSubGift: " gifted a sub to",
  onCheer: " cheered ",
  onRaid: " raided the stream with ",
  onHosted: " hosted the stream with "
};

function alert(user, gif, audio, type) {
  console.log(gif); // queue.add(() =>

  queue.add(async () => {
    console.log('testt komen we hier?');
    audio.play();
    container.innerHTML = `
            <h1 class="text-shadows">${user + generateTitle[type]}</h1>
            <img src="${gif}" />
        `;
    container.style.opacity = 1;
    await wait(DISPLAY_DURATION);

    if (!queue.isLooping) {
      container.style.opacity = 0;
    }
  });
}
},{"comfy.js":"node_modules/comfy.js/app.js","queue":"node_modules/queue/index.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54974" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/twitch-bot.e31bb0bc.js.map