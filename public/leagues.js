if( document.readyState === 'complete' ) {
    startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        startPage();
    });
}

function adminPrivileges(elem) {
	elem.parentNode.removeChild(elem); 
}

function replaceDeleteBtn(deleteBtn){
	var par = deleteBtn.parentNode;	

	deleteBtn.removeAttribute("onclick"); 
	deleteBtn.innerText = "Exit league"; 
	deleteBtn.removeAttribute("hidden"); 

	
	deleteBtn.addEventListener("click", function() {
		var req = new XMLHttpRequest(); 
		var url = "/leagues/exit"; 		
		var params = "leagueId=" + this.value; 
		req.open("POST", url, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.addEventListener('load', function() {
			if (req.status >= 200 && req.status < 400) {
				window.location.replace("/leagues"); 
			}
			else {
				console.log("Error in request"); 
			} 	
		});		
		req.send(params); 		
	}); 
	
}

function startPage() {
	var admins = document.getElementsByName("admin"); 
	//admins = Array.from(admins)
	var username = document.getElementById("username");
	
	for (var i = 0; i < admins.length; i++) {
			var deleteBtn = admins[i].nextSibling.nextSibling.firstChild;
			if (admins[i].innerText == username.value) {
				deleteBtn.removeAttribute("hidden");	
				admins[i].nextSibling.nextSibling.nextSibling.nextSibling.firstChild.removeAttribute("hidden");
			}
			else  {
				replaceDeleteBtn(deleteBtn); 
				var updateLink = admins[i].nextSibling.nextSibling.nextSibling.nextSibling.firstChild; 
				updateLink.parentNode.removeChild(updateLink);  
			}
	}
	
	document.getElementById("publicKey").addEventListener("keyup", checkJoin); 
}

function checkJoin() {
	var publicKeys = document.getElementsByClassName("publicKeys"); 
	var keyFound = 0; 
	var i = 0; 
	var typedKey = this.value; 
	var typedKey = typedKey.trim(); 
	while (i < publicKeys.length) {
		if (typedKey == publicKeys[i].innerText && typedKey.length > 0) {
			document.getElementById("joinSubmit").setAttribute("hidden", "hidden"); 
			existingKey(); 
			keyFound = 1; 
			break;
		}
		else {
			if (document.getElementById("joinSubmit").hasAttribute("hidden")) {
				document.getElementById("joinSubmit").removeAttribute("hidden"); 

			}
		}
		i = i + 1; 
	}
	
	if (document.getElementById("messageSpan") && keyFound == 0) {
		var msg = document.getElementById("messageSpan"); 
		msg.parentNode.removeChild(msg); 
	}

}

function existingKey() {
	if (!document.getElementById("messageSpan")) {
		var div = document.getElementById("messageDiv"); 
		var msg = document.createElement("span"); 
		msg.setAttribute("id", "messageSpan"); 
		msg.textContent = "You've already joined this league."; 
		div.appendChild(msg);
	}
}

function removeInvalidText(keyFound) {
	if (document.getElementById("messageSpan") && keyFound == 1) {
		var msg = document.getElementById("messageSpan"); 
		msg.parentNode.removeChild(msg); 
	}
}