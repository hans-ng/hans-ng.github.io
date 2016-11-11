window.onload = function() {
  var url = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=5&_jsonp=updateQuotes" + "&dummy=" + (new Date()).getTime();
  var script = document.createElement("script");
  script.setAttribute("src", url);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(script);
  
  var button = document.getElementById("previewButton");
  button.onclick = previewHandler;
  
  makeImage();
}

function makeImage() {
  var canvas = document.getElementById("tshirtCanvas");
  canvas.onclick = function() {
    window.location = canvas.toDataURL("image/png");
  }
}

function previewHandler() {
  var canvas = document.getElementById("tshirtCanvas");
  var context = canvas.getContext("2d");
  
  fillBackgroundColor(canvas, context);
  
  var selectObj = document.getElementById("shape");
  var index = selectObj.selectedIndex;
  var shape = selectObj[index].value;
  
  if (shape == "squares") {
    for (var squares = 0; squares < 20; squares++) {
      drawSquares(canvas, context);
    }
  } else if (shape == "circles") {
    for (var circles = 0; circles < 20; circles++) {
      drawCircles(canvas, context);
    }
  }
  
  drawText(canvas, context);
  
  drawBird(canvas, context);
}

function fillBackgroundColor(canvas, context) {
  var selectObj = document.getElementById("backgroundColor");
  var index = selectObj.selectedIndex;
  var backgroundColor = selectObj[index].value;

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSquares(canvas, context) {
  var w = Math.floor(Math.random() * 40);
  var x = Math.floor(Math.random() * canvas.width);
  var y = Math.floor(Math.random() * canvas.height);
  
  context.fillStyle = "lightblue";
  context.fillRect(x, y, w, w);
}

function drawCircles(canvas, context) {
  var radius = Math.floor(Math.random() * 40);
  var x = Math.floor(Math.random() * canvas.width);
  var y = Math.floor(Math.random() * canvas.height);
  
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, true);
  context.fillStyle = "lightblue";
  context.fill();
}

function updateQuotes(quotes) {
  var quotesSelection = document.getElementById("quotes");
  
  for (var i = 0; i < quotes.length; i++) {
    var quote = quotes[i].content;
    var option = document.createElement("option");
    option.innerHTML = quote;
    quotesSelection.options.add(option);
  }
  
  quotesSelection.selectedIndex = 0;
}

function drawText(canvas, context) {
  var selectObj = document.getElementById("foregroundColor");
  var index = selectObj.selectedIndex;
  var foregroundColor = selectObj[index].value;
  
  context.fillStyle = foregroundColor;
  context.font = "bold 1em sans-serif";
  context.textAlign = "left";
  context.fillText("I saw this quote:", 20, 40);
  
  // Get the selected quote from the quotes menu
  var quotesSelection = document.getElementById("quotes");
  var index = quotesSelection.selectedIndex;
  var quote = quotesSelection[index].value;
  // Draw the quote
  context.font = "italic 1.2em sans-serif";
  context.textAlign = "center";
  context.fillText(quote, canvas.width / 2, canvas.height / 2, 550);
  
  context.font = "bold 1em sans-serif";
  context.textAlign = "right";
  context.fillText(", and all I got was this lousy t-shirt", canvas.width - 20, canvas.height - 40);
}

function drawBird(canvas, context) {
  var twitterBird = new Image();
  twitterBird.src = "./Twitter_Logo_White_On_Blue.png";
  twitterBird.onload = function() {
    context.drawImage(twitterBird, 20, 120, 70, 70);
  }
}
