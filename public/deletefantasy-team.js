function deleteFantasyTeam(id){
    $.ajax({
        url: '/fantasy-teams/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
