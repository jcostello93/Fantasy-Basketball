function deletePlayer(id){
    $.ajax({
        url: '/players/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};