if( document.readyState === 'complete' ) {
	startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
		startPage();
    });
}

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


function startPage() {
	ownerPrivileges(); 
	makeButtons(); 
	searchLastName(); 
	searchTeam(); 
	addFromSelect(); 
}

function ownerPrivileges() {
	var removeButtons = document.getElementsByClassName("removeButtons"); 
	var owner = document.getElementById("owner"); 
	var username = document.getElementById("username"); 
	
	if (owner.value == username.value) {
		document.getElementById("addPlayerh4").removeAttribute("hidden"); 
		document.getElementById("searchplayer").removeAttribute("hidden"); 
		
		document.getElementById("changeTeamh4").removeAttribute("hidden"); 
		document.getElementById("update-fantasy-team").removeAttribute("hidden"); 
		document.getElementById("chooseTeams").removeAttribute("hidden");  

		
		for (var i = 0; i < removeButtons.length; i++) {
			removeButtons[i].removeAttribute("hidden"); 
		}				
	}
	else {
		document.getElementById("addPlayerh4").parentNode.removeChild(document.getElementById("addPlayerh4")); 
		document.getElementById("searchplayer").parentNode.removeChild(document.getElementById("searchplayer")); 
		document.getElementById("chooseTeams").parentNode.removeChild(document.getElementById("chooseTeams")); 
		
		document.getElementById("changeTeamh4").parentNode.removeChild(document.getElementById("changeTeamh4"));  
		document.getElementById("update-fantasy-team").parentNode.removeChild(document.getElementById("update-fantasy-team")); 
		
		//remove entire td instead of just button
		var i = 0; 
		while (removeButtons.length > 0) {
			removeButtons[0].parentNode.parentNode.removeChild(removeButtons[0].parentNode); 
		}			
		
		var rosterH4 = document.getElementById("rosterH4");
		rosterH4.style.marginTop = "0px";
		
		var rosterTable = document.getElementsByName("rosterTable")[0];
		rosterTable.style.marginTop = "10px";
		rosterTable.setAttribute("class", "myTable2");
		rosterTable.style.fontSize = "13px";
		
	}

}


function makeButtons() {

	var buttons = document.getElementsByTagName('button');

	for (var i = 1; i < buttons.length; i++) {
		(function(i){
			buttons[i].addEventListener('click', function(event) {
				var req = new XMLHttpRequest(); 
				
				var fantasyId = document.getElementsByName("rosterTable")[0].id; 
				var parameters = "playerId="+this.value+"&fantasyId="+fantasyId;
				
				/*if (!document.getElementById("playerTable")) {
					var fantasyId = document.getElementsByName("rosterTable")[0].id; 
					var parameters = "playerId="+this.value+"&fantasyId="+fantasyId;
				}
				else {
					var fantasyId = document.getElementsByTagName("table")[2].id; 
					var parameters = "playerId="+this.value+"&fantasyId="+fantasyId;
				}*/
				
				var thisRow = this.parentNode.parentNode; 
				thisRow.parentNode.removeChild(thisRow); 

				req.open("GET", "/remove?" + parameters, true); 
				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
				req.addEventListener('load', function () {
					if (req.status >= 200 && req.status < 400) {
						var response = JSON.parse(req.responseText); 

					}
					else {
						console.log("Error"); 
					}
				}); 
			req.send(null); 
			event.preventDefault(); 
		}); })(i); 		
	}
	
}

function searchLastName() {
	if (document.getElementById("searchplayer")) {
		document.getElementById("searchplayer").addEventListener('submit', function(event) {
					var req = new XMLHttpRequest(); 
					var name = document.getElementById("searchname"); 
					//var id = buttons[i].value; 
					//var fantasyId = document.getElementsByTagName("table")[1].id; 
					var teamId = document.getElementsByName("rosterTable")[0].id;
					var fantasyId = document.getElementById("fantasyId").value; 
					var parameters = "lname="+name.value+"&fantasyId="+fantasyId;
					req.open("GET", "/search?" + parameters, true); 
					req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
					req.addEventListener('load', function () {
						if (req.status >= 200 && req.status < 400) {
							var response = JSON.parse(req.responseText); 
							var myDiv = document.getElementById("myDiv"); 
							myDiv.style.cssFloat = "right";
							myDiv.style.marginRight = "75px";

							if(myDiv.firstChild) {
								myDiv.removeChild(myDiv.firstChild); 
							}

							var tbl = document.createElement("table"); 				// dynamically create table 
							tbl.setAttribute("class", "myTable"); 					// for search results 
							tbl.style.width = "100%"
							tbl.setAttribute("id", "playerTable"); 
							var thead = document.createElement("thead"); 
							var tbody = document.createElement("tbody"); 

							var tr = document.createElement("tr");
							var th = document.createElement("th"); 
							th.innerText = "First name";
							tr.appendChild(th); 

							var th = document.createElement("th"); 
							th.innerText = "Last name";
							tr.appendChild(th); 

							var th = document.createElement("th"); 
							th.innerText = "Team";
							tr.appendChild(th); 
								
							var th = document.createElement("th"); 
							th.innerText = "Position(s)";
							tr.appendChild(th);						 	
							thead.appendChild(tr); 		
							tbl.appendChild(thead); 

							for (var i = 0; i < response.options.length; i++){
								var tr = document.createElement("tr"); 
								var td = document.createElement("td"); 
								td.innerText = response.options[i].fname; 
								tr.appendChild(td); 

								var td = document.createElement("td"); 
								td.innerText = response.options[i].lname; 
								tr.appendChild(td); 

								var td = document.createElement("td"); 
								td.innerText = response.options[i].team_name; 
								tr.appendChild(td); 

								var td = document.createElement("td"); 
								td.innerText = response.options[i].pos; 
								tr.appendChild(td); 

								var td = document.createElement("td"); 
								var btn = document.createElement("button"); 
								btn.innerText = "Add";
								btn.value = response.options[i].playerId;

								btn.addEventListener("click", function(event) {				// add player to team
									var req = new XMLHttpRequest(); 
									var parameters = "playerId="+this.value+"&teamId="+document.getElementById("searchteam").value; 

									req.open("GET", "/add?" + parameters, true); 
									req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
									req.addEventListener('load', function () {
									if (req.status >= 200 && req.status < 400) {
										var response = JSON.parse(req.responseText); 
										var tbody = document.getElementsByName("rosterBody")[0];
										//var tbody = document.getElementsByTagName("table")[2].firstChild.nextElementSibling.nextElementSibling;
										//var tr = document.createElement("tr"); 
										var tr = tbody.insertRow(0);

										var td = document.createElement("td"); 
										td.innerText = response.added[0].fname;
										tr.appendChild(td); 

										var td = document.createElement("td"); 
										td.innerText = response.added[0].lname;
										tr.appendChild(td); 

										var td = document.createElement("td"); 
										td.innerText = response.added[0].team_name;
										tr.appendChild(td); 

										var td = document.createElement("td"); 
										td.innerText = response.added[0].pos;
										tr.appendChild(td);

										var td = document.createElement("td"); 
										var btn = document.createElement("button"); 
										btn.innerText = "Remove"; 
										btn.value = response.added[0].playerId;

										btn.addEventListener("click", function(event) {			// remove player
											var req = new XMLHttpRequest(); 
											//var id = buttons[i + document.getElementById("playerTable").rows.length - 1].value; 
											//var fantasyId = document.getElementsByTagName("table")[2].id; 
											var teamId = document.getElementsByName("rosterTable")[0].id;
											var fantasyId = teamId; 
											var parameters = "playerId="+this.value+"&fantasyId="+fantasyId;

											req.open("GET", "/remove?" + parameters, true); 
											req.setRequestHeader('Content-Type', 'applicatthiion/x-www-form-urlencoded'); 
											req.addEventListener('load', function () {
												if (req.status >= 200 && req.status < 400) {
													var response = JSON.parse(req.responseText);																	
												}
												else {
													console.log("Error"); 
												}
											}); 
											req.send(null); 
											event.preventDefault(); 
											var deleterow = btn.parentNode.parentNode;
											deleterow.parentNode.removeChild(deleterow); 	
										});

										td.appendChild(btn); 
										tr.appendChild(td); 
										//tbody.appendChild(tr); 
										
									}
									else { 
										console.log('Error in network request:' + request.responseText); 
									}

								}); 							
									
									var garbageRow = this.parentNode.parentNode;
									var tbdy = garbageRow.parentNode; 
									var tbl = garbageRow.parentNode.parentNode; 
									garbageRow.parentNode.removeChild(garbageRow); 
									if (tbdy.childElementCount == 0) {
										tbl.parentNode.removeChild(tbl); 
									}														
									req.send(null); 
									event.preventDefault(); 
								}); 				

								td.appendChild(btn); 
								tr.appendChild(td); 						
								tbody.appendChild(tr); 
							}
							
							tbl.appendChild(tbody); 
							myDiv.appendChild(tbl); 					
						}
						else {
							console.log("Error"); 
						}
					}); 
				req.send(null); 
				event.preventDefault();
		}); 
	}
}

function searchTeam() {
	var changeteam = document.getElementById("changeteam"); 
	changeteam.addEventListener("change", function () {
		var req = new XMLHttpRequest(); 
		var id = changeteam.options[changeteam.selectedIndex].value; 
		var fantasyId = document.getElementById("fantasyId").value; 
		var parameters = "id=" + id + "&fantasyId=" + fantasyId; 
		req.open("GET", "/change?" + parameters, true); 
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText); 
				var myFieldset = document.getElementById("myFieldset"); 
				//var changeleague = document.getElementById('changeleague'); 
				var player = document.getElementById("player"); 

				while (player.firstChild) {
					player.removeChild(player.firstChild); 
				}
					
				for (var i = 0; i < response.options.length; i++) {
					var opt = document.createElement('option'); 
					opt.value = response.options[i].playerId;
					var fullname = response.options[i].fname;
					fullname = fullname + " " + response.options[i].lname;
					opt.textContent = fullname; 
					opt.innerHTML = fullname; 
					player.appendChild(opt); 					
				}
			}
			else {
				console.log('Error in network request:' + request.responseText); 
			}
		});
		req.send(null); 
		event.preventDefault(); 	
	}); 
}

function addFromSelect() {
	var chooseTeams = document.getElementById("chooseTeams"); 
	chooseTeams.addEventListener("submit", function (event) {
		event.preventDefault(); 
		var req = new XMLHttpRequest(); 
		var player = document.getElementById("player"); 
		var playerId = player.options[player.selectedIndex].value; 
		player.remove(player.selectedIndex); 
		player.selectedIndex = 0; 
		var parameters = "playerId=" + playerId + "&teamId=" + document.getElementById("searchteam").value; 

		req.open("GET", "/add?" + parameters, true); 
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText); 
				var tbody = document.getElementsByName("rosterBody")[0];
				//var tbody = document.getElementsByTagName("table")[2].firstChild.nextElementSibling.nextElementSibling;
			//	var tr = document.createElement("tr"); 
				var tr = tbody.insertRow(0); 
				var td = document.createElement("td"); 
				td.innerText = response.added[0].fname;
				tr.appendChild(td); 

				var td = document.createElement("td"); 
				td.innerText = response.added[0].lname;
				tr.appendChild(td); 

				var td = document.createElement("td"); 
				td.innerText = response.added[0].team_name;
				tr.appendChild(td); 

				var td = document.createElement("td"); 
				td.innerText = response.added[0].pos;
				tr.appendChild(td);

				var td = document.createElement("td"); 
				var btn = document.createElement("button"); 
				btn.innerText = "Remove"; 
				btn.value = response.added[0].playerId;

				btn.addEventListener("click", function(event) {			// remove player
					var req = new XMLHttpRequest(); 
					//var id = buttons[i + document.getElementById("playerTable").rows.length - 1].value; 
					//var fantasyId = document.getElementsByTagName("table")[2].id; 
					var teamId = document.getElementsByName("rosterTable")[0].id;
					var fantasyId = teamId; 
					var parameters = "playerId="+this.value+"&fantasyId="+fantasyId;

					req.open("GET", "/remove?" + parameters, true); 
					req.setRequestHeader('Content-Type', 'applicatthiion/x-www-form-urlencoded'); 
					req.addEventListener('load', function () {
						if (req.status >= 200 && req.status < 400) {
							var response = JSON.parse(req.responseText);																	
						}
						else {
							console.log("Error"); 
						}
					}); 
					req.send(null); 
					event.preventDefault(); 
					var deleterow = btn.parentNode.parentNode;
					deleterow.parentNode.removeChild(deleterow); 	
				});

				td.appendChild(btn); 
				tr.appendChild(td); 
				//tbody.appendChild(tr); 
				
				
			}

			else { 
				console.log('Error in network request:' + request.responseText); 
			}
		}); 	
		
		req.send(null); 
		event.preventDefault(); 
	});
}
