var zakoemon = zakoemon || 
(function(){

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
                var _now = new Date();
                
                return {
                    getYear : function(){
                        return _now.getYear();
                    }
                    ,getMonth : function(){
                        return _now.getMonth() + 1;
                    }
                    ,getDate : function(){
                        return _now.getDate();
                    }
                    ,getHours : function(){
                        return _now.getHours();
                    }
                    ,getMinutes : function(){
                        return _now.getMinutes();
                    }
                    ,getSeconds : function(){
                        return _now.getSeconds();
                    }
                    ,getDatetimeString : function(){

                        var _dateArr = [], _timeArr = [];

                        _dateArr.push(this.getYear());
                        _dateArr.push(this.getMonth());
                        _dateArr.push(this.getDate());
                        _timeArr.push(this.getHours());
                        _timeArr.push(this.getMinutes());
                        _timeArr.push(this.getSeconds());

                        if(arguments.length === 0){
                            return _dateArr.join('/') + ' ' + _timeArr.join(':');
                        }else if(arguments.length === 2){
                            return _dateArr.join(arguments[0].trim()) + ' ' + _timeArr.join(arguments[1].trim());
                        }else{
                            throw 'arguments wrong';
                        }
                    }
                }
            }
        }
    })();
    
    var writer = (function(){

        function write(txt, path){
            var stream = new ActiveXObject('ADODB.Stream');
            stream.Mode = 3;
            stream.Type = 2;
            stream.Charset = 'UTF-8';
            stream.Open();
            stream.LoadFromFile(path);
            stream.Position = stream.Size;
            stream.WriteText(txt, 1);
            stream.SaveToFile(path, 2);
            stream.Close();
            stream = null;
        }

        return {
            write:write
        }
    })();

    return {
        clone:function(src, out){
            var prop;
            for(prop in src.prototype){
                out.prototype[prop] = src.prototype[prop];
            }
        }
        ,getDateHandler:function(){
            return _dateStringBuilter.build();
        }
        ,write:function(txt, filePath){
            writer.write(txt, filePath);
        }
        ,logError:function(log){
            var dateHandler = _dateStringBuilter.build(),
                now = null,
                path = this.getPathHandler().buildFilePath('log.txt');
            now = dateHandler.getDatetimeString();
            this.write('[' + now + '] ' + log, path);
        }
        ,getPathHandler:function(){
            return _filePath;
        }
    }
})();


