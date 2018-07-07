if( document.readyState === 'complete' ) {
    startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        startPage();
    });
}

function startPage() {
		var resetPasswordSubmit = document.getElementById("resetPasswordSubmit"); 
		resetPasswordSubmit.addEventListener("click", function(event) {
			removeInvalidText(); 
			removeSuccessText(); 
			var req = new XMLHttpRequest(); 
			var url = "/password"; 
			var params = "email=" + document.getElementById("emailText").value;
			req.open("POST", url, true);
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.addEventListener('load', function() {
				if (req.status >= 200 && req.status < 400) {
					//var response = JSON.parse(req.responseText); 	
					if (req.responseText == 1) {
						successEmail();
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

function invalidEmail() {
	var body = document.body;
	var invalidText = document.createElement("span"); 
	invalidText.setAttribute("id", "invalidText"); 
	invalidText.textContent = "This email is not linked with an account."; 
	invalidText.style.marginLeft = "70px";
	body.appendChild(invalidText); 
}

function removeInvalidText() {
	if (document.getElementById("invalidText")) {
		var invalidText = document.getElementById("invalidText"); 
		invalidText.parentNode.removeChild(invalidText); 
	}
}

function successEmail() {
	var body = document.body;
	if (!document.getElementById("successText")) {
		var successText = document.createElement("span"); 
		successText.setAttribute("id", "successText"); 
		successText.textContent = "Temporary password sent. Please check your email."; 
		successText.style.marginLeft = "70px";
		body.appendChild(successText); 
	}
}

function removeSuccessText() {
	if (document.getElementById("successText")) {
		var successText = document.getElementById("successText"); 
		successText.parentNode.removeChild(successText); 
	}
}