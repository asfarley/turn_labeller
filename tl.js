var movement_index = 0;
var movement_classifications = [];
var movements_list = [];

//Wrap code in this so that document is available
window.onload = function(){ 

	function DownloadFile()
	{
		console.log("Downloading...");
		var text = movement_classifications.toString();
		var hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:attachment/text,' + encodeURI(text);
		hiddenElement.target = '_blank';
		hiddenElement.download = 'movement_classifications.txt';
		hiddenElement.click();
	}
	
	function DrawMovement()
	{
		var c=document.getElementById('scenecanvas');
		var ctx=c.getContext("2d");
		ctx.drawImage(img,0,0,320,240);
		try{
			this_movement = JSON.parse(movements_list[movement_index]);
			this_movement.StateEstimates.forEach(function(element){
				var c=document.getElementById('scenecanvas');
				var ctx=c.getContext("2d");
				ctx.beginPath();
				ctx.arc(element.X, element.Y, 3, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'green';
				ctx.fill();
			});	
		}
		catch(e)
		{}
	}
	
	function GetMovementsJson()
	{
		var val = document.getElementById('urlinput').value;
		var movements_json_url = val + 'Movements.json';
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", movements_json_url, false); // false for synchronous request
		xmlHttp.send( null );
		movements_list_string = xmlHttp.responseText;
		movements_list = movements_list_string.split("\n");
	}

    document.getElementById('urlbutton').onclick = function() {
		GetMovementsJson();
		var val = document.getElementById('urlinput').value;
		src = val + 'RegionsLegend.png';
		img = document.getElementById('background');
		img.onload = function() {
			DrawMovement();				
		};
		img.src = src;
		return;
	}
	
	document.getElementById('leftbutton').onclick = function() {
		movement_classifications.push("left");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('rightbutton').onclick = function() {
		movement_classifications.push("right");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}

	document.getElementById('straightbutton').onclick = function() {
		movement_classifications.push("straight");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('uturnbutton').onclick = function() {
		movement_classifications.push("uturn");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('otherbutton').onclick = function() {
		movement_classifications.push("other");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
};