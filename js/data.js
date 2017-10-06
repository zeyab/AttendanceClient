studentService = (function(){
    var fb = new Firebase("<fbio>");
    var findById = function(id){
        var deferred = $.Deferred();
        var studentRef = fb.child('<db>'+id);
        if(!studentRef){
            throw new Error("Student does not exist.");
        }
        studentRef.once('value', function(snap) {
                   deferred.resolve(snap.val());
               });
       
        return deferred.promise();
    }
    return {
        findById : findById
    }
}());

attendanceService = (function(){
    var fb = new Firebase("<fbio>");
    
    var markPresent = function(id){
        var d = new Date(); 
        var deferred = $.Deferred();
        var month = ''+(d.getMonth() + 1),
            date = ''+d.getDate(),
            year = ''+d.getFullYear(),
            hours = ''+d.getHours(),
            minutes = ''+d.getMinutes();

        if(minutes < 10){
            minutes = '0' + minutes;
        }


        var dateStamp = month + '/' + date + '/' + year,
            timeStamp = hours + ':' + minutes;

        var stamp =  dateStamp + ' ' + timeStamp;
        console.log(stamp);
        var list = [];
        var resultDeferred = $.Deferred();
        var studentRef = fb.child('<attendanceDB>'+id);
        studentRef.once('value', function(snap){
                                            list = snap.val();
                                            if(!list){
                                                list = [];
                                            }
                                            list.push(stamp);
                                            var succ = studentRef.set(list);
                                            succ.then(function(resp){
                                                resultDeferred.resolve({'stamp': stamp, 'dateStamp': dateStamp, 'timeStamp': timeStamp });
                                            });
                                        }
                                    );
        return resultDeferred.promise();
    }

    return{
        markPresent : markPresent
    };
}());
