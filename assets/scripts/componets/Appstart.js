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
        _version:null,
        _progress:0.0,
    },

    onLoad () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.label.string = "";
        initMgr();
        let self = this;
        self.showSplash(function(){
            self.getLoacalVersion(function(){
                self.getServerInfo(function(){
                    self.startPreloading()
                })
            })
        });
    },

    getLoacalVersion:function(callback){
        var url = cc.url.raw('resources/texttures/ver/cv.txt');
        let self = this;
        cc.loader.load(url,function(err,data){
            self._version = data;
            console.log(self._version);
            callback()
        });
    },

    startPreloading:function(){
        this.log( "正在加载资源，请稍候");
        var self = this;
        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            if(self._isLoading){
                self._progress = completedCount/totalCount;
                self.log(`正在加载资源${_progress}%`);
            }
        };
        
        cc.loader.loadRes("textures", function (err, assets) {
            self.onLoadComplete();
        });      
    },

    onLoadComplete:function(){
        this.log("准备登陆");
        cc.loader.onComplete = null;
        this._loginFrame = cc.find("Canvas/login_frame");
        this.log("");
        this._loginFrame.active = true;
    },
    

    showSplash:function(callback){
        var self = this;
        var SHOW_TIME = 2000;
        var FADE_TIME = 500;
        this._splash = cc.find("Canvas/logo");
        this._splash.active = true;
        var action = cc.fadeOut(2.0);
        this._splash.runAction(action);
        callback();
    },


    getServerInfo:function(callback){
        var self = this;
        var onGetVersion = function(ret){
            if(ret == null){
                self.log( "获取版本号错误");
                console.log("error.");
            }
            else{
                if(ret != self._version){
                    self.log( "版本需要升级");
                    cc.find("Canvas/alert").active = true;
                }
                else
                {
                    callback();
                }
            }
        };
        
        var fnRequest = function(){
            self.log( "正在连接服务器...");
            setTimeout(function(){
                let data = "1.0.1"
                onGetVersion(data);
            },2000);         
        }

         fnRequest();
    },

    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.SI.appweb);
    },

    log:function(str){
        this.label.string = str;
    }

    // update (dt) {},
});
