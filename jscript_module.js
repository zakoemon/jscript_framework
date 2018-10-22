var zakoemon = zakoemon || 
(function(){
/**
 * Add extensions to built-in objects here
 */
    //Add trim() to String object for jscript
    String.prototype.trim = function(){
        return this.replace(/(^s+|s+$)/g,'');
    }

    var _filePath = _filePath || (function(){
        var arr = WScript.ScriptFullName.split('\\');
        arr.pop(arr.length - 1);

        return {
            getProjectPath:function(){
                return arr.join('\\');
            }
            ,buildFilePath:function(file){
                var tmpArr = arr.slice();
                tmpArr.push(file);
                return tmpArr.join('\\');
            }
        }
    })();

    var _dateStringBuilter = _dateStringBuilter || (function(){

        return{
            build : function(){
                var _now = new Date(),
                    _dateArr = [], _timeArr = [];

                    _dateArr.push(_now.getYear());
                    _dateArr.push(_now.getMonth());
                    _dateArr.push(_now.getDate());
                    _timeArr.push(_now.getHours());
                    _timeArr.push(_now.getMinutes());
                    _timeArr.push(_now.getSeconds());
                
                return {
                    getYear : function(){
                        return _dateArr[0];
                    }
                    ,getMonth : function(){
                        return _dateArr[1];
                    }
                    ,getDate : function(){
                        return _dateArr[2];
                    }
                    ,getHours : function(){
                        return _timeArr[0];
                    }
                    ,getMinites : function(){
                        return _timeArr[1];
                    }
                    ,getSeconds : function(){
                        return _timeArr[2];
                    }
                    ,getDateString : function(){
                        if(arguments.length == 0){
                            return _dateArr.join('/') + ' ' + _timeArr.join(':');
                        }
                    }
                }
            }
        }
    })();
    
    var _ioSingleton = _ioSingleton || (function(){

        var _instance;

        function _init(){
            if(!_instance){
                _instance = function(){
                    var stream = null;
                    
                    return {
                        initialize : function(){
                            if(!stream) stream = new ActiveXObject('ADODB.Stream');
                        }
                        ,finalize : function(){
                            stream = null;
                        }
                        ,write : function(txt, path){
                            this.initialize();
                            stream.Mode = 3;
                            stream.Type = 2;
                            stream.Charset = 'UTF-8';
                            stream.Open();
                            stream.LoadFromFile(path);
                            stream.Position = stream.Size;
                            stream.WriteText(txt, 1);
                            stream.SaveToFile(path, 2);
                            stream.Close();
                            this.finalize();
                        }
                    }
                }
            }
            return _instance;
        }

        return {
            getInstance : _init()
        }
    })();

    return {
        clone:function(src, out){
            var prop;
            for(prop in src.prototype){
                out.prototype[prop] = src.prototype[prop];
            }
        }
        ,popUp:function(txt){
            WScript.Echo(txt);
        }
        ,getDateHandler:function(){
            return _dateStringBuilter.build();
        }
        ,write:function(txt, filePath){
            var ioInstance = _ioSingleton.getInstance();
            ioInstance.write(txt, filePath);
        }
        ,logError:function(log){
            var dateHandler = _dateStringBuilter.build(),
                now = null,
                path = this.getPathHandler().buildFilePath('log.txt');
            now = dateHandler.getDateString();
            this.write('[' + now + '] ' + log, path);
        }
        ,getPathHandler:function(){
            return _filePath;
        }
    }
})();


zakoemon.logError('Hello, world');
