//tracks whether a right click is active
//a right click is active when pressed, becomes deactivated after 400ms
var r = false;

//left click counter that increments when left button is
//pushed, released, or the mouse is moved
var l = 0;

var mousex = 0;
var mousey = 0;

var mousex_init = 0;
var mousey_init = 0;

//checks activation for a fast left-right click
var lr = 0;

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function open(url) {
  chrome.runtime.sendMessage({greeting: url});
}

$('body').mousedown(function(event) {
    switch (event.which) {
        case 1:
            console.log('Left Mouse button pressed.');
            if(!lr){
              lr = 1;
              setTimeout(function() {
              if(lr == 1)
                 lr = 0;
               }, 300 );
            } else if(lr == 2) {
              open("close");
            }

            l++;
            //check if the counter is still the same when time elapses
            var l2 = l;
            setTimeout(function(l2) {
              if(l == l2)
              {
                 text = getSelectionText();
                 if(text) {
                   open("https://google.com/search?q=" + text);
                }
               }
            }, 400, l2 );
            break;
        case 3:
            console.log('Right clicked ' + r);

            if(!r){
              r = true;
              setTimeout(function() { r = false; }, 400 );
            }
    }
});

$('body').mouseup(function(event) {
    switch (event.which) {
        case 1:
            l++;
            break;
        case 3:
            console.log('Right unclicked ' + r);
            lr = 0;
            if(r){
              r = false;
              var text = getSelectionText();
              if(text)
              {
                document.execCommand('copy');
                $("body").append('<div id="ca_msg">Copied!</div>');
                $("#ca_msg").css({
                  "top" : mousey,
                  "left" : mousex + 15,
                  "position": "absolute",
                  "background": "white"
                });
                setTimeout(function() { $("#ca_msg").remove(); }, 300);
              }
              else
                document.execCommand('paste');
            }
    }
});

$(document).mousemove(function(event) {
  mousex = event.pageX;
  mousey = event.pageY;
  l++;
  if(lr == 2)
  {
    if(mousey - mousey_init > 10) //down
      open("http://messenger.com");
    else if(mousey_init - mousey > 10) //up
      open("http://reddit.com");
    else if(mousex - mousex_init > 10) //right
      open("http://gmail.com");
    else if(mousex_init - mousex > 10) //left
      open("https://youtube.com");
    else
      return;
    lr = 0;
  }
});

$('body').on('contextmenu', function(e) {
  console.log(lr);
  if(lr)
  {
    lr = 2;
    mousex_init = mousex;
    mousey_init = mousey;
    return false;
  }
})
