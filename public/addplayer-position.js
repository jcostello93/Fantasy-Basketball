var changeteam = document.getElementById('changeteam');
changeteam.addEventListener('change', function(event) {

    var req = new XMLHttpRequest(); 

    var id = changeteam.options[changeteam.selectedIndex].value; 
    console.log(id); 

    var parameters = "id="+id; 
    req.open("GET", "/change?" + parameters, true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            
   
        }
        else {
            console.log('Error in network request:' + request.responseText);
        }
    });
req.send(null); 
event.preventDefault();     
    

}); 

function addPlayer_Position(id){
    $.ajax({
        url: '/change/' + id,
        type: 'GET',
        data: $('#addplayer-position').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};