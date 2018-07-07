if( document.readyState === 'complete' ) {
    startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        startPage();
    });
}
function startPage(){
	document.getElementById("passwordText").addEventListener("keyup", checkPassword); 
	document.getElementById("verifyPassword").addEventListener("keyup", checkPassword); 
	var registerSubmit = document.getElementById("registerSubmit"); 
	registerSubmit.addEventListener("click", function(event) {
		removeInvalidText();
		removeNonmatchingPasswords(); 
		removeBadSize();
		if (document.getElementById('passwordText').value == document.getElementById('verifyPassword').value) {
			if (document.getElementById('passwordText').value.trim().length > 4 && document.getElementById('passwordText').value.trim().length < 21) {
				var req = new XMLHttpRequest(); 
				var url = "/register"; 
				var params = "username=" + document.getElementById("userText").value + "&password=" + document.getElementById("passwordText").value + "&email=" + document.getElementById("emailText").value; 
				req.open("POST", url, true);
				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				req.addEventListener('load', function() {
					if (req.status >= 200 && req.status < 400) {
						if (req.responseText == "ER_DUP_ENTRY") {
							invalidRegister(); 
						}
						else {
							successfulRegister(); 
							setTimeout(function() { 
								window.location.replace("/"); 
							}, 3500);
						}
					}
					else {
						console.log("Error in request"); 
					} 	
				});
			} 
			else {
				badSize(); 
			}
		} else {
			nonmatchingPasswords(); 
		}
			
			event.preventDefault(); 
			req.send(params); 
	});	
}

function checkPassword(){
	if (document.getElementById('passwordText').value == document.getElementById('verifyPassword').value) {
		document.getElementById('message').style.color = 'green';
		document.getElementById('message').innerHTML = 'matching';
	} else {
		document.getElementById('message').style.color = 'red';
		document.getElementById('message').innerHTML = 'not matching';
	}
}

function badSize() {
	var bodyDiv = document.getElementById("bodyDiv");
	var spn = document.createElement("span"); 
	spn.setAttribute("id", "badSize"); 
	spn.style.cssFloat = "left";
	spn.style.marginTop = "150px";
	spn.style.marginLeft = "-400px";
	spn.textContent = "Your password must have 5-20 characters"; 
	bodyDiv.appendChild(spn);	
}

function removeBadSize() {
	if (document.getElementById("badSize")) {
		var spn = document.getElementById("badSize"); 
		spn.parentNode.removeChild(spn); 
	}
}

function nonmatchingPasswords() {
	var bodyDiv = document.getElementById("bodyDiv");
	var nonmatchingPassword = document.createElement("span"); 
	nonmatchingPassword.setAttribute("id", "nonmatchingPassword");
	nonmatchingPassword.style.cssFloat = "left";
	nonmatchingPassword.style.marginTop = "150px";
	nonmatchingPassword.style.marginLeft = "-400px";
	nonmatchingPassword.textContent = "Your password and confirmation password do not match. Please try again."; 
	bodyDiv.appendChild(nonmatchingPassword);
}

function removeNonmatchingPasswords() {
	if (document.getElementById("nonmatchingPassword")) {
		var nonmatchingPassword = document.getElementById("nonmatchingPassword"); 
		nonmatchingPassword.parentNode.removeChild(nonmatchingPassword); 
	}
}

function successfulRegister() {
	var bodyDiv = document.getElementById("bodyDiv");
	var successText = document.createElement("span"); 
	successText.setAttribute("id", "successText"); 
	successText.style.cssFloat = "left";
	successText.style.marginTop = "150px";
	successText.style.marginLeft = "-400px";
	successText.textContent = "Registration successful! Redirecting to login page ..."; 
	bodyDiv.appendChild(successText); 
}

function invalidRegister() {
	var body = document.body;
	var invalidText = document.createElement("span"); 
	invalidText.setAttribute("id", "invalidText"); 
	invalidText.style.cssFloat = "left";
	invalidText.style.marginTop = "150px";
	invalidText.style.marginLeft = "-400px";
	invalidText.textContent = "This username is already taken. Please try again."; 
	body.appendChild(invalidText); 
}

function removeInvalidText() {
	if (document.getElementById("invalidText")) {
		var invalidText = document.getElementById("invalidText"); 
		invalidText.parentNode.removeChild(invalidText); 
	}
}