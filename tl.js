var movement_index = 0;
var movement_classifications = [];
var movements_list = [];

//Wrap code in this so that document object is available.
window.onload = function(){

	//From jwir3/canvasArrowhead.js on Github
	function drawArrowhead(context, start, to, radius) {
		var X_center = to.X;
		var Y_center = to.Y;

		var angle;
		var X;
		var Y;

		context.beginPath();

		angle = Math.atan2(to.Y - start.Y, to.X - start.X)
		X = radius * Math.cos(angle) + X_center;
		Y = radius * Math.sin(angle) + Y_center;

		context.moveTo(X, Y);

		angle += (1.0/3.0) * (2 * Math.PI)
		X = radius * Math.cos(angle) + X_center;
		Y = radius * Math.sin(angle) + Y_center;

		context.lineTo(X, Y);

		angle += (1.0/3.0) * (2 * Math.PI)
		X = radius *Math.cos(angle) + X_center;
		Y = radius *Math.sin(angle) + Y_center;

		context.lineTo(X, Y);
		context.closePath();
		context.stroke();
		context.fill();
	}	

	function DrawArrowOnCanvas(stateEstimate)
	{
		var angleRadians = Math.atan(stateEstimate.vY, stateEstimate.vX);
		var angleDegrees = angleRadians * 180.0/Math.PI;
		
		var naturalWidth = img.naturalWidth;
		var naturalHeight = img.naturalHeight;
		var X_scaling = 320/naturalWidth;
		var Y_scaling = 240/naturalHeight;
		var c=document.getElementById('scenecanvas');
		var ctx=c.getContext("2d");
		ctx.beginPath();
		var X_scaled = stateEstimate.X*X_scaling;
		var Y_scaled = stateEstimate.Y*Y_scaling;
		
		var start = new Object();
		var end = new Object();
		start.X = X_scaled;
		start.Y = Y_scaled;
		end.X = X_scaled + X_scaling*stateEstimate.Vx*0.1;
		end.Y = Y_scaled + Y_scaling*stateEstimate.Vy*0.1;
		
		ctx.strokeStyle="#FF0000";
		drawArrowhead(ctx, start, end, 5.0);
	}
	
	function DrawPointOnCanvas(stateEstimate)
	{
		var naturalWidth = img.naturalWidth;
		var naturalHeight = img.naturalHeight;
		var X_scaling = 320/naturalWidth;
		var Y_scaling = 240/naturalHeight;
		var c=document.getElementById('scenecanvas');
		var ctx=c.getContext("2d");
		ctx.beginPath();
		var X_scaled = stateEstimate.X*X_scaling;
		var Y_scaled = stateEstimate.Y*Y_scaling;
		ctx.strokeStyle="#FF0000";
		ctx.arc(X_scaled, Y_scaled, 3, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.fillStyle = "#f0f0f5";
		ctx.fill();
	}
	
	function DrawTextOnCanvas(X,Y,text)
	{
		var naturalWidth = img.naturalWidth;
		var naturalHeight = img.naturalHeight;
		var X_scaling = 320/naturalWidth;
		var Y_scaling = 240/naturalHeight;
		
		var c=document.getElementById('scenecanvas');
		var ctx=c.getContext("2d");
		ctx.beginPath();
		var X_scaled = X*X_scaling;
		var Y_scaled = Y*Y_scaling;
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		ctx.strokeText(text,X_scaled,Y_scaled);
		ctx.fillStyle = 'white';
		ctx.fillText(text,X_scaled,Y_scaled);
		ctx.fill();
	}

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
			//Draw starting point
			var start_point = this_movement.StateEstimates[0];
			DrawTextOnCanvas(start_point.X, start_point.Y, "Start");
			
			//Draw end-point
			var end_point = this_movement.StateEstimates[this_movement.StateEstimates.length - 1];
			DrawTextOnCanvas(end_point.X, end_point.Y, "End");
			
			this_movement.StateEstimates.forEach(function(element){
				//DrawPointOnCanvas(element);
				DrawArrowOnCanvas(element);
			});	
		}
		catch(e)
		{
			console.log(e);
		}
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
	
	document.getElementById('crossingbutton').onclick = function() {
		LabelMovementAs("Crossing");
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
	
	document.getElementById('undobutton').onclick = function() {
		if(movement_index > 0)
		{
			movement_index--;
			UpdatePercentage();
			movement_classifications.pop();
			DrawMovement();
		}
		return;
	}
};