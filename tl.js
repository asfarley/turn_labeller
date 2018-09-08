var movement_index = 0;
var movement_classifications = [];
var movements_list = [];

//Wrap code in this so that document is available
window.onload = function(){ 

	function LabelMovementAs(label)
	{
		this_movement = JSON.parse(movements_list[movement_index]);
		this_movement.TurnType_HumanLabel = label;
		console.log("Labelled movement:");
		console.log(this_movement);
		movement_classifications.push(this_movement);
	}

	function UpdatePercentage()
	{
		var c=document.getElementById('progressindicator');	
		var progress_percent = 100.0 * movement_index / movements_list.length;
		c.innerHTML = progress_percent.toFixed(2).toString() + "% complete.";
	}

	function DownloadFile()
	{
		console.log("Downloading...");
		var text = "";
		movement_classifications.forEach(function(element){
			text += element.toString() + "\r\n";
		});
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
		var naturalWidth = img.naturalWidth;
		var naturalHeight = img.naturalHeight;
		var X_scaling = 320/naturalWidth;
		var Y_scaling = 240/naturalHeight;
		ctx.drawImage(img,0,0,320,240);
		try{
			this_movement = JSON.parse(movements_list[movement_index]);
			this_movement.StateEstimates.forEach(function(element){
				var c=document.getElementById('scenecanvas');
				var ctx=c.getContext("2d");
				ctx.beginPath();
				var X_scaled = element.X*X_scaling;
				var Y_scaled = element.Y*Y_scaling;
				ctx.arc(X_scaled, Y_scaled, 3, 0, 2 * Math.PI, false);
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
		LabelMovementAs("Left");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
			UpdatePercentage();
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('rightbutton').onclick = function() {
		LabelMovementAs("Right");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
			UpdatePercentage();
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}

	document.getElementById('straightbutton').onclick = function() {
		LabelMovementAs("Straight");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
			UpdatePercentage();
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('uturnbutton').onclick = function() {
		LabelMovementAs("UTurn");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
			UpdatePercentage();
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
	
	document.getElementById('otherbutton').onclick = function() {
		LabelMovementAs("Unknown");
		if(movement_index < (movements_list.length - 1))
		{
			movement_index++;
			UpdatePercentage();
		}
		else
		{
			DownloadFile();
		}
		DrawMovement();
		return;
	}
};