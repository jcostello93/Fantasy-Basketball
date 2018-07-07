if( document.readyState === 'complete' ) {
	isLoggedIn(); 
} else {
    document.addEventListener('DOMContentLoaded', function () {
        isLoggedIn(); 
    });
}

function addMenuLinks() {
	regularDiv = document.getElementById("regularDiv");
	if (regularDiv && !document.getElementById("teamsLink")) {
		var teams = document.createElement("a");
		teams.href = "/fantasy-teams/"; 
		teams.innerHTML = "My teams"; 
		teams.setAttribute("id", "teamsLink");
		
		var leagues = document.createElement("a");
		leagues.href = "/leagues/"; 
		leagues.innerHTML = "My leagues"; 
		leagues.setAttribute("id", "leaguesLink");
		leagues.style.float = "middle";
		
		var matchup = document.createElement("a");
		matchup.href = "/matchup/"; 
		matchup.innerHTML = "Matchup"; 
		matchup.setAttribute("id", "matchupLink");
		
		br = document.createElement("br");
		regularDiv.appendChild(leagues);
		regularDiv.appendChild(br);
		regularDiv.appendChild(teams);

		br = document.createElement("br");
		regularDiv.appendChild(br);
		regularDiv.appendChild(matchup);
	}
	
}

function afterLogin() {
	var body = document.body;
    var  html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
	height = height + "px";
	var regularDiv = document.getElementById("regularDiv");
	if (regularDiv){
		regularDiv.style.height = height; 
		//regularDiv.style.width = "150px";
	}
	//addMenuLinks(); 
}

function restructureDiv(loginDiv) {
		var header = document.getElementById("header");
		if (header){
			loginDiv.parentNode.removeChild(loginDiv);		
			header.appendChild(loginDiv);
			header.style.height = "100%";
		//	loginDiv.style.margin = "0 auto";
			//loginDiv.style.width = "10%";
		}

}

function createLoginForm() {

	var loginDiv = document.getElementById("loginDiv"); 
	
	
	
	var homepage = document.getElementById("homepage");
	//if (homepage.value == "true") {
		restructureDiv(loginDiv)
	//}
	
	
	loginDiv.removeAttribute("hidden"); 
	var loginForm = document.createElement("form"); 
	loginForm.setAttribute("id", "loginForm"); 

	var userText = document.createElement("input"); 
	userText.setAttribute("type", "text"); 
	userText.setAttribute("name", "username"); 
	userText.setAttribute("value", "username"); 
	userText.setAttribute("id", "userText"); 

	var passwordText = document.createElement("input");
	passwordText.setAttribute("type", "password"); 
	passwordText.setAttribute("name", "password"); 
	passwordText.setAttribute("value", "password"); 
	passwordText.setAttribute("id", "passwordText"); 


	var loginSubmit = document.createElement("input"); 
	loginSubmit.setAttribute("type", "submit"); 
	loginSubmit.setAttribute("value", "Login"); 

	loginSubmit.addEventListener("click", function(event) {
		var req = new XMLHttpRequest(); 
		var url = "/login"; 
		var params = "username=" + document.getElementById("userText").value + "&password=" + document.getElementById("passwordText").value; 
		
		req.open("POST", url, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.addEventListener('load', function() {
			if (req.status >= 200 && req.status < 400) {
				//var response = JSON.parse(req.responseText); 	
				if (req.responseText == "update") {
					// update password from temporary 
					window.location.replace("/user/" + document.getElementById("userText").value);
				}
				else if (req.responseText != -1) {
					//removeForm(req.responseText); 
					//afterLogin();
					window.location.replace("/matchup");
					//location.reload(); 
				}
				else {
					removeInvalidText(); 
					invalidLogin(); 
				}
			}
			else {
				console.log("Error in request"); 
			} 	
		});
		
		event.preventDefault(); 
		req.send(params); 
	});

	var a = document.createElement("a"); 
	a.href = "/register/"; 
	a.innerHTML = "Register"; 
	a.setAttribute("id", "registerLink"); 
	
	var forgotPassword = document.createElement("a"); 
	forgotPassword.href = "/password"; 
	forgotPassword.innerHTML = "Reset password"; 
	forgotPassword.setAttribute("id", "forgotPassword"); 

	userText.style.width = "20%";
	passwordText.style.width = "20%";
	loginDiv.style.textAlign = "center";
	loginDiv.style.marginLeft = "65px";

	
	var br = document.createElement("br");
	loginForm.appendChild(userText); 
	loginForm.appendChild(br);
	br = document.createElement("br");
	loginForm.appendChild(passwordText);
	loginForm.appendChild(br);
		
	loginForm.appendChild(loginSubmit); 
	loginDiv.appendChild(loginForm); 
	br = document.createElement("br");
	loginForm.appendChild(br);
	loginDiv.appendChild(a); 
	br = document.createElement("br");
	loginDiv.appendChild(br);
	br = document.createElement("br");
	loginDiv.appendChild(forgotPassword); 
	br = document.createElement("br");
	loginDiv.appendChild(br);
	


}


function removeForm(username) {
	var loginDiv = document.getElementById("loginDiv"); 
	loginDiv.removeAttribute("hidden");
	restructureDiv(loginDiv);
	if (document.getElementById("loginForm")) {
		var loginForm = document.getElementById("loginForm"); 
		//loginForm.parentNode.removeChild(loginForm); 
		loginForm.style.display = "none"; 
	}
	
	if (document.getElementById("registerLink")) {
		document.getElementById("registerLink").parentNode.removeChild(document.getElementById("registerLink")); 
	}
	
	if (document.getElementById("forgotPassword")) {
		document.getElementById("forgotPassword").parentNode.removeChild(document.getElementById("forgotPassword")); 
	}
	
	if (document.getElementById("invalidText")) {
		document.getElementById("invalidText").parentNode.removeChild(document.getElementById("invalidText")); 
	}
	
	if (!document.getElementById("userLink")) {
		var a = document.createElement("a"); 
		a.href = "/user/" + username; 
		a.innerHTML = username; 
		a.setAttribute("id", "userLink"); 
		a.setAttribute("class", "menuLinks");
		loginDiv.appendChild(a); 
		
		var br = document.createElement("br");
		
		var b = document.createElement("a"); 
		b.href = "/logout"; 
		b.innerHTML = "logout"; 
		b.setAttribute("class", "menuLinks");
		loginDiv.appendChild(b); 	

		var homepage = document.getElementById("homepage");
		
		if (homepage.value == "true") {
			loginDiv.style.cssFloat = "middle"; 
		}
		else {
			loginDivUnderSmallImg(loginDiv);
		}
		
		
	}
	
}

function isLoggedIn() {
	if (homepage.value == "true") {
		document.getElementById("bodyDiv").style.marginLeft = "";
	}	
	document.getElementById("bodyDiv").removeAttribute("hidden");

	
	var req = new XMLHttpRequest(); 
	var url = "/login"; 		
	req.open("GET", url, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.addEventListener('load', function() {
		if (req.status >= 200 && req.status < 400) {
			//var response = JSON.parse(req.responseText); 	
			if (req.responseText) {
				//logged in 
				removeForm(req.responseText); 
				afterLogin();
			}
			else {
				if (window.location.href == "https://fantasyproject.me/" || window.location.href == "https://www.fantasyproject.me/")  {
					createLoginForm(); 
				}
			}
		}
		else {
			console.log("Error in request"); 
		} 	
	});		
	req.send(null); 	
}


function invalidLogin() {
	var loginDiv = document.getElementById("loginDiv"); 
	var invalidText = document.createElement("span"); 
	invalidText.setAttribute("id", "invalidText"); 
	invalidText.textContent = "Invalid login data. Please try again."; 
	loginDiv.appendChild(invalidText); 
}

function removeInvalidText() {
	if (document.getElementById("invalidText")) {
		var invalidText = document.getElementById("invalidText"); 
		invalidText.parentNode.removeChild(invalidText); 
	}
}

function updatePasswordPage() {
		var resetPasswordSubmit = document.getElementById("resetPasswordSubmit"); 
		resetPasswordSubmit.addEventListener("click", function(event) {
			removeInvalidText(); 
			var req = new XMLHttpRequest(); 
			var url = "/password"; 
			var params = "email=" + document.getElementById("emailText").value;
			req.open("POST", url, true);
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.addEventListener('load', function() {
				if (req.status >= 200 && req.status < 400) {
					//var response = JSON.parse(req.responseText); 	
					if (req.responseText == 1) {
						
					}
					else {
						invalidEmail(); 
					}
				}
				else {
					console.log("Error in request"); 
				} 	
				
			});		
			event.preventDefault(); 
			req.send(params); 

		});
}

function loginDivUnderSmallImg(loginDiv) {
	var regularDiv = document.getElementById("regularDiv"); 
	var smallImg = document.getElementById("smallImg");
	loginDiv.style.textAlign = "left";
	loginDiv.style.marginLeft = "0";
	
	regularDiv.insertBefore(loginDiv, regularDiv.childNodes[2]);
}
