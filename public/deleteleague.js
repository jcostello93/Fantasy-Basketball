function deleteLeague(id){
    $.ajax({
        url: '/leagues/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
