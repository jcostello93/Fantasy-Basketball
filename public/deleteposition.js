function deletePosition(id){
    $.ajax({
        url: '/positions/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};