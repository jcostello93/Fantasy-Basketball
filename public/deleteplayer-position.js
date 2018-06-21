function deletePlayerPosition(id){
    $.ajax({
        url: '/players-positions/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};