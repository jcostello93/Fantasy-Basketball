function updateFantasyTeam(id){
    $.ajax({
        url: '/fantasy-teams/' + id,
        type: 'PUT',
        data: $('#update-fantasy-team').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
