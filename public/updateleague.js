function updateLeague(id){
    $.ajax({
        url: '/leagues/' + id,
        type: 'PUT',
        data: $('#update-league').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
