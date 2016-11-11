window.onload = function() {
  getQuote();
  
  var newQuoteButton = document.getElementById("new-quote");
  newQuoteButton.onclick = getQuote;
  
  var tweetButton = document.getElementById("tweet");
  var quoteHolder = document.getElementById("quote-holder");
  tweetButton.onclick = tweetQuote;
}

// Get a random quote from quoteondesign.com
function getQuote() {
  var url = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=updateQuote" + "&dummy=" + (new Date()).getTime(); //&dummy=Date.getTime() to renew url and pass browser cache
  
  var headElement = document.getElementsByTagName("head")[0];
  
  var newScriptElement = document.createElement("script");
  newScriptElement.setAttribute("src", url);
  newScriptElement.setAttribute("id", "jsonp");

  var oldScriptElement = document.getElementById("jsonp");
  
  if (oldScriptElement == null) {
    headElement.appendChild(newScriptElement);
  } else {
    headElement.replaceChild(newScriptElement, oldScriptElement);
  }
}

function updateQuote(quote) {
  var quoteHolder = document.getElementById("quote-holder");
  quoteHolder.innerHTML = quote[0].content;
  
  var randomColor = Math.floor(Math.random()*256*256*256);
  var contrastColor = 256*256*256 - randomColor;
  
  document.body.style.background = "#" + randomColor.toString(16);
  
  quoteHolder.style.background = "#" + contrastColor.toString(16);
  quoteHolder.style.opacity = 0.7;
  quoteHolder.style.color = "#" + randomColor.toString(16);
  
  var buttons = document.getElementsByTagName("button");
  
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.background = quoteHolder.style.background;
    buttons[i].style.color = quoteHolder.style.color;
    //buttons[i].style.opacity = quoteHolder.style.opacity;
  }
}

function tweetQuote() {
  var quoteElement = document.getElementById("quote-holder");
  var quote = quoteElement.innerHTML;
  
  quote = quote.replace("<p>","");
  quote = quote.replace("</p>\n","");
  
  if (quote.length > 140) {
    quote = quote.substring(0,138);
    
    console.log("Before: \n");
    console.log(quote);
    console.log(quote.length);
    
    var indexOfLastSpace = quote.lastIndexOf(" ");
    if (indexOfLastSpace < 138) {
      quote = quote.substring(0, indexOfLastSpace);
    }
    
    console.log("\nAfter: \n");
    console.log(quote);
    console.log(quote.length);
    
    quote += "...";
  }
  
  var tweetLink = "https://twitter.com/home?status=" + encodeURIComponent(quote);
  window.open(tweetLink,"_blank");
}
