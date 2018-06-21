function updateAward(id){
    $.ajax({
        url: '/awards/' + id,
        type: 'PUT',
        data: $('#update-award').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};