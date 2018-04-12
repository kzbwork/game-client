let co = require("co");

function urlParse(){
    var params = {};
    if(window.location == null){
        return params;
    }
    var name,value; 
    var str=window.location.href; //取得整个地址栏
    var num=str.indexOf("?") 
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            params[name]=value;
        } 
    }
    return params;
}

function initMgr(){
    cc.vv = {};
    // var UserMgr = require("UserMgr");
    // cc.vv.userMgr = new UserMgr();
    
    // var ReplayMgr = require("ReplayMgr");
    // cc.vv.replayMgr = new ReplayMgr();
    
    // cc.vv.http = require("HTTP");
    // cc.vv.global = require("Global");
    // cc.vv.net = require("Net");
    
    // var GameNetMgr = require("GameNetMgr");
    // cc.vv.gameNetMgr = new GameNetMgr();
    // cc.vv.gameNetMgr.initHandlers();
    
    // var AnysdkMgr = require("AnysdkMgr");
    // cc.vv.anysdkMgr = new AnysdkMgr();
    // cc.vv.anysdkMgr.init();
    
    // var VoiceMgr = require("VoiceMgr");
    // cc.vv.voiceMgr = new VoiceMgr();
    // cc.vv.voiceMgr.init();
    
    // var AudioMgr = require("AudioMgr");
    // cc.vv.audioMgr = new AudioMgr();
    // cc.vv.audioMgr.init();
    
    // var Utils = require("Utils");
    // cc.vv.utils = new Utils();
    
    // //var MJUtil = require("MJUtil");
    // //cc.vv.mjutil = new MJUtil();
    
    // cc.args = urlParse();
}


cc.Class({
    extends: cc.Component,

    properties: {
        label:{
            type:cc.Label,
            default:null
        },
        _stateStr:'',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.label.string = this._stateStr;
        initMgr();
        this.showSplash()
        let version= this.getLoacalVersion();
        //let checkVeision = this.getServerInfo(version);
        // co(function *(){

        //     // let loadComponents = new Promise(initMgr);
        //     // yield loadComponents;

        //     // let showSplashInfo = new Promise(this.showSplash)
        //     // yield showSplashInfo;

        //     // let getLocalV = new Promise(this.getLoacalVersion);
        //     // let version = yield getLocalV;

        //     // let checkVeision = new Promise(this.getServerInfo(version));
        //     // yield checkVeision;

        // });
    },

    getLoacalVersion:function(){
        var url = cc.url.raw('../../resources/ver/cv.txt');
        cc.loader.load(url,function(err,data){
            console.log('current core version:' + data);
            return data;
        });
    },

    showSplash:function(callback){
        var self = this;
        var SHOW_TIME = 2000;
        var FADE_TIME = 500;
        this._splash = cc.find("Canvas/logo");
        this._splash.active = true;
        var t = Date.now();
        var fn = function(){
            var dt = Date.now() - t;
            if(dt < SHOW_TIME){
                setTimeout(fn,33);
            }
            else {
                var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
                if(op < 0){
                    self._splash.opacity = 0;  
                    callback()
                    return;
                }
                else{
                    self._splash.opacity = op;
                    setTimeout(fn,33);   
                }
            }
        };
        setTimeout(fn,33);
    },


    getServerInfo:function(version){
        var self = this;
        var onGetVersion = function(ret){
            if(ret.version == null){
                console.log("error.");
            }
            else{
                cc.vv.SI = ret;
                if(ret.version != cc.VERSION){
                    cc.find("Canvas/alert").active = true;
                }
                else
                {
                    return;
                }
            }
        };
        
        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            this._stateStr = "正在连接服务器...";
            // xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
            //     xhr = null;
            //     complete = true;
            //     onGetVersion(ret);
            // });
            setTimeout(function(){
                onGetVersion("1.1.1");
            },2000);         
        }
        
        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();
                    this._stateStr = "连接失败，即将重试";
                    setTimeout(function(){
                        fnRequest();
                    },5000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },

    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.SI.appweb);
    },

    // update (dt) {},
});
