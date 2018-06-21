function updatePlayerPosition(id){
    $.ajax({
        url: '/players-positions/' + id,
        type: 'PUT',
        data: $('#update-player-position').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};