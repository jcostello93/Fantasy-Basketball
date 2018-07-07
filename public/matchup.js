if( document.readyState === 'complete' ) {
	startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
       startPage(); 
    });
}

function avoid(skip, idx) {
    for (var i = 0; i < skip.length; i++) {
        if (skip[i] == idx) {
            return 1;
        }
    }    

    return 0;
}

function addTDs(tr) {
    var skip = [0, 2, 4, 5, 6, 7, 8, 9, 10];

    for (var i = 0; i < 12; i++) {
        var td = document.createElement("td");
        if (avoid(skip, i)) {
            td.setAttribute("hidden", "hidden");
        }
        tr.appendChild(td);
    }
}

function addDataFromAJAX(response, id) {

    //console.log(id);
    var tblId = id + "tbdy"; 
    var tbl = document.getElementById("team1tbdy");
   // console.log(tblId);
    //console.log(tbl); 
    for (var i = 0; i < response.team1.length; i++) {
        var tr = document.createElement("tr");
        addTDs(tr); 
        tbl.appendChild(tr);
        addData(response.team1[i], response.players1[i], i, tr, 1);
    }

	addCells(tbl.parentNode);
	
	var tbl = document.getElementById("team2tbdy");
	// console.log(tblId);
	 //console.log(tbl); 
	 for (var i = 0; i < response.team2.length; i++) {
		 var tr = document.createElement("tr");
		 addTDs(tr); 
		 tbl.appendChild(tr);
		 addData(response.team2[i], response.players2[i], i, tr, 2);
	 }
 
	 addCells(tbl.parentNode);

	 document.getElementById("team1caption").innerHTML = document.getElementById("team1").options[document.getElementById("team1").selectedIndex].innerHTML;
	 document.getElementById("team2caption").innerHTML = document.getElementById("team2").options[document.getElementById("team2").selectedIndex].innerHTML;

	}

function removeRows(id) {
    var tblId = id + "tbdy"; 
	var tbl = document.getElementById(tblId);
	while (tbl.firstChild) {
		tbl.removeChild(tbl.firstChild);
	}

	var tr = tbl.previousElementSibling.firstElementChild;
	if (tr.lastChild.id == "total") {
		tr.removeChild(tr.lastChild);
		tr.removeChild(tr.lastChild);
	}

}

function setupAJAX(id) {
	document.getElementById("chooseTeams").addEventListener("submit", function(event) {
	//	document.getElementById("mySubmit").setAttribute("hidden", "hidden");
		document.getElementById("mySubmit").disabled = true; 
		var req = new XMLHttpRequest(); 
		var url = "/matchup"; 

		var params = "team1="; 
		var team1 = document.getElementById("team1").options[document.getElementById("team1").selectedIndex].value;
		var team2 = document.getElementById("team2").options[document.getElementById("team2").selectedIndex].value;
		params += team1 + "&team2=" + team2;
        if (this.selectedIndex != 0) {
            req.open("POST", url, true);
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.addEventListener('load', function() {
                if (req.status >= 200 && req.status < 400) {
                    var response = JSON.parse(req.responseText);
					document.getElementById("mySubmit").disabled = false; 
					removeRows("team1");
					removeRows("team2");
					addDataFromAJAX(response); 
					//document.getElementById("mySubmit").removeAttribute("hidden");

                }
                
                else {
                    console.log("Error in request"); 
                } 	
            });
        
            event.preventDefault(); 
            req.send(params); 
        }
		else {
			document.getElementById("mySubmit").disabled = false; 
		}
	});

}

function startPage() {

    updateLeagues(); 
    setupAJAX("team1"); 
	var table2 = document.getElementById("team2Tbl"); 
	table2.style.marginRight = "70px"; 

}
 


function addData(player, response, i, row, num) {
    //console.log(JSON.parse(response));
    response = JSON.parse(response);
    var leagueName; 
    //console.log(response);
	for (var x in response.league) {
		// Using career stats during offseason because API is getting updated.

		//This code works fine during the regular season.
		// var ppg = +response.league.standard.stats... 
		
		var ppg = +response.league[x].stats.careerSummary.ppg;
		var rpg = +response.league[x].stats.careerSummary.rpg;
		var apg = +response.league[x].stats.careerSummary.apg;
		var spg = +response.league[x].stats.careerSummary.spg;
		var bpg = +response.league[x].stats.careerSummary.bpg;
		//var topg = +response.league[x].stats.careerSummary.topg;
		var tpm = +response.league[x].stats.careerSummary.tpm;
		var gp = +response.league[x].stats.careerSummary.gamesPlayed;
		var turnovers = +response.league[x].stats.careerSummary.turnovers;
		var topg = turnovers / gp; 
		topg = Math.round(topg * 10) / 10; 
		tpm = tpm / gp; 
		var dd2 = +response.league[x].stats.careerSummary.dd2;
		var td3 = +response.league[x].stats.careerSummary.td3;
		dd2 = dd2 / gp; 
		td3 = td3 / gp; 
		var fppg = ppg + 1.25*rpg + 1.5*apg + 2*spg + 2*bpg - 0.5*topg + 0.5*tpm + 1.5*dd2 + 3 * td3; 
		fppg = Math.round( fppg * 10 ) / 10;

		addText(row, ppg, rpg, apg, spg, bpg, topg, tpm, dd2, td3, fppg, player.fname, player.lname, player.team_name); 
	}		
}

function addText(row, ppg, rpg, apg, spg, bpg, topg, tpm, dd2, td3, fppg, fname, lname, team) {
    //this is wrong
	row.children[1].innerHTML = fname + " " + lname;
	row.children[3].innerHTML = team;

	var data = [ppg, rpg, apg, spg, bpg, topg, fppg];
	var i = 0; 
	while (i < 7) {
		var current = row.children[i + 5]; 
		current.innerHTML = data[i]; 
		i = i + 1; 
	}

	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = ppg; 
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = rpg;
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = apg;  
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = spg;  	
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = bpg; 
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = topg; 
	//row.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = fppg; 

	var tr = row; 
	var newtd = document.createElement("td"); 
	//row.appendChild(newtd); 	
	var dd = document.createElement("select"); 
	for (var i = 0; i < 5; i++) {
		var opt = document.createElement("option"); 
		opt.innerText = i; 	
		opt.setAttribute("value", i); 
		dd.appendChild(opt); 
	}
	dd.setAttribute("class", "tblDropDown");
	dd.style.height = "20px";
	dd.style.fontSize = "10px";
	dd.style.float = "middle"
	dd.addEventListener("change", updatePlayerTotal); 
	newtd.appendChild(dd); 
	row.appendChild(newtd); 

	var total = document.createElement("td");	
	total.innerText = "0";
	total.id = "total";  
	tr.appendChild(total); 

}

function addCells(tbl) {	
	var tr = tbl.firstElementChild.nextSibling.nextSibling.firstElementChild;
	
	/*var th = document.createElement("th");
	th.innerText = "# Games"; 
	th.setAttribute("class", "tooltip");
	var spn = document.createElement("span");
	spn.setAttribute("class", "tooltiptext");
	spn.innerHTML = "No. eligible games this week"
	th.appendChild(spn);
	tr.appendChild(th);  


	var th = document.createElement("th");
	th.innerText = "Total"; 
	th.setAttribute("id", "total");
	tr.appendChild(th); */


	tr = tr.parentNode.nextSibling.nextSibling.firstElementChild; 

	var tbdy = tbl.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling;


	var finalRow = document.createElement("tr");  

	for (var i = 0; i < 3; i++) {
		var tmp = document.createElement("td"); 
		finalRow.appendChild(tmp); 	
			
	}

	var totalstr = document.createElement("td"); 
	totalstr.innerText = "Total"; 
	finalRow.appendChild(totalstr); 

	var totalnum = document.createElement("td"); 
	totalnum.innerText = 0; 
	finalRow.appendChild(totalnum); 

	tbdy.appendChild(finalRow); 

	
}

function updateLeagues () {
	
	var changeleague = document.getElementById('changeleague'); 
	changeleague.addEventListener('change', function(event) {
	
		var req = new XMLHttpRequest(); 
		var id = changeleague.options[changeleague.selectedIndex].value; 

		var parameters = "id="+id; 
		//console.log(changeleague); 
		req.open("GET", "/matchup/change?" + parameters, true); 
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText); 

				var myFieldset = document.getElementById("myFieldset"); 
				var changeleague = document.getElementById('changeleague'); 

				var team1 = document.getElementById("team1"); 
				var team2 = document.getElementById("team2"); 

				while (team1.firstChild) {
					team1.removeChild(team1.firstChild); 
					team2.removeChild(team2.firstChild); 
				}
                    
				for (var i = 0; i < response.options.length; i++) {
					var opt = document.createElement('option'); 
					opt.value = response.options[i].id;
					opt.textContent = response.options[i].name; 
					opt.innerHTML = response.options[i].name; 
					team1.appendChild(opt); 
					
					var opt = document.createElement('option'); 
					opt.value = response.options[i].id;
					opt.textContent = response.options[i].name; 
					opt.innerHTML = response.options[i].name; 
					team2.appendChild(opt); 
					
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

function updatePlayerTotal() {
	var playerTotal = +this.parentNode.nextSibling.innerHTML;
	var numGames = this.value; 
	var fppg = +this.parentNode.previousElementSibling.innerHTML;  
	playerTotal = fppg * numGames; 
	playerTotal = Math.round( playerTotal * 10 ) / 10;
	this.parentNode.nextSibling.innerHTML = playerTotal;
	updateTeamTotal(this.parentNode.parentNode.parentNode); 
}

function updateTeamTotal(tbdy) {
	var teamTotal = 0;
	for (var i = 0; i < tbdy.rows.length; i++) {
		if (i < tbdy.rows.length - 1 && +tbdy.rows[i].lastChild.innerHTML > 0) {
		//	console.log(tbdy.rows[i].lastChild.innerHTML);
			teamTotal += +tbdy.rows[i].lastChild.innerHTML; 
		}
		else if (i == tbdy.rows.length - 1){
		//	console.log(teamTotal); 
			teamTotal = Math.round(teamTotal * 10) / 10; 
			tbdy.rows[i].lastChild.innerHTML = teamTotal; 
		}
	}


}
