if( document.readyState === 'complete' ) {
    startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        startPage();
    });
}

function startPage() {
	var updatePasswordSubmit = document.getElementById("updatePasswordSubmit"); 
	updatePasswordSubmit.addEventListener("click", function(event) {
		removeNonmatchingPasswords(); 
		removeInvalidText(); 
		if (document.getElementById('newPasswordText').value == document.getElementById('verifyPassword').value) {
			var req = new XMLHttpRequest(); 
			var url = "/user"; 
			var params = "oldPassword=" + document.getElementById("oldPasswordText").value + "&newPassword=" + document.getElementById("newPasswordText").value; 
			req.open("POST", url, true);
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.addEventListener('load', function() {
				if (req.status >= 200 && req.status < 400) {
					if (req.responseText == 1) {
						passwordSuccess(); 						
					}
					else {
						oldPasswordIncorrect(); 
					}
				}
				else {
					console.log("Error in request"); 
				} 	
			});
		} else {
			nonmatchingPasswords(); 
		}
			
			event.preventDefault(); 
			req.send(params); 
	});	
	
	
	document.getElementById("newPasswordText").addEventListener("keyup", checkPassword); 
	document.getElementById("verifyPassword").addEventListener("keyup", checkPassword); 
	
}

function checkPassword(){
	if (document.getElementById('newPasswordText').value == document.getElementById('verifyPassword').value) {
		document.getElementById('message').style.color = 'green';
		document.getElementById('message').innerHTML = 'matching';
	} else {
		document.getElementById('message').style.color = 'red';
		document.getElementById('message').innerHTML = 'not matching';
	}
}

function nonmatchingPasswords() {
	var body = document.body;
	var nonmatchingPassword = document.createElement("span"); 
	nonmatchingPassword.setAttribute("id", "nonmatchingPassword"); 
	nonmatchingPassword.textContent = "Your password and confirmation password do not match. Please try again."; 
	body.appendChild(nonmatchingPassword);
}

function removeNonmatchingPasswords() {
	if (document.getElementById("nonmatchingPassword")) {
		var nonmatchingPassword = document.getElementById("nonmatchingPassword"); 
		nonmatchingPassword.parentNode.removeChild(nonmatchingPassword); 
	}
}

function oldPasswordIncorrect() {
	var body = document.body;
	var invalidText = document.createElement("span"); 
	invalidText.setAttribute("id", "invalidText"); 
	invalidText.textContent = "Old password is incorrect. Please try again."; 
	body.appendChild(invalidText); 
}

function removeInvalidText() {
	if (document.getElementById("invalidText")) {
		var invalidText = document.getElementById("invalidText"); 
		invalidText.parentNode.removeChild(invalidText); 
	}
}

function passwordSuccess() {
	var body = document.body;
	var successText = document.createElement("span"); 
	successText.setAttribute("id", "successText"); 
	successText.textContent = "Password change successful!"; 
	body.appendChild(successText); 
}