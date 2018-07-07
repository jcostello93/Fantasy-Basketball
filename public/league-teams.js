if( document.readyState === 'complete' ) {
    startPage();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        startPage();
    });
}

function removeMargin() {
	var tbl = document.getElementsByClassName("myTable2")[0];
	tbl.style.marginTop = "0px";
	tbl.style.fontSize = "13px";
}

function startPage() {
	assignDeleteButtons(); 	
	removeMargin();
}

function deleteElem(elem) {
	elem.parentNode.removeChild(elem); 
}

function assignDeleteButtons() {
	var deleteButtons = document.getElementsByClassName("deleteButtons"); 
	for (var i = 0; i < deleteButtons.length; i++) {
		deleteButtons[i].addEventListener("click", function() {
			var req = new XMLHttpRequest(); 
			var url = '/fantasy-teams/'; 		
			var params = this.value; 
			var tr = this.parentNode.parentNode; 
			req.open("DELETE", url + params, true);
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.addEventListener('load', function() {
				if (req.status >= 200 && req.status < 400) {
					deleteElem(tr); 
				}
				else {
					console.log("Error in request"); 
				} 	
			});		
			req.send(null); 		
		}); 	
	}
}