$(document).ready(function(){
    requestToserver();
})


var requestToserver=function(){
    var path=[];
$.ajax({
    url:"http://127.0.0.1:8000/all",
    type: "GET",
    async:true,

    success:function (response) {
        //console.log(JSON.stringify(response));
        console.log(response);
        for(var i=0; i<response.data.length;i++) {
            path.push({lat:response.data[i].latitude,lng:response.data[i].longitude});
        }
    },
    error:function (response, status, error) {
        console.log('response: '+response+'\n status: '+status+' \nerr:'+ error);
    },
    complete:function () {
            initMap(path);

    },
    progress:function () {

    },
    cache:false,
    contentType:false,
    processData:false

})
}