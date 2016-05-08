//https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
WebGlWorks = function() {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}();

var totalFile = (WebGlWorks)?(16):3;
var loadedFile = 0;
var totalElem = document.getElementById('total');
var loadedElem = document.getElementById('loaded');
totalElem.textContent = totalFile;
loadedElem.textContent = loadedFile;
loadedCallback = function() {
    loadedFile++;
    loadedElem.textContent = loadedFile;
    if (loadedFile == totalFile) {
        document.getElementById('loader').remove();
        if(WebGlWorks){ startRender();}else{
          if(!WebGlWorks){
            $(".page#index").append('<iframe src="https://www.youtube.com/embed/-iQ5YKIo_cU?autoplay=1&fs=0&loop=1&rel=0&showinfo=false&controls=0" frameborder="0"></iframe>');
          }
        }
        startMain();
    }
};

$script(['javascript/lib/jquery/jquery-2.2.2.min.js'], function() {
  loadedCallback();
    $script(['javascript/lib/jquery/jquery.lettering.js', 'javascript/lib/jquery/jquery.textillate.js'], function(){
      loadedCallback();
    });
    if(!WebGlWorks){
      $('body').addClass('noWebGL');
      $script(["javascript/main.js"], function(){
        loadedCallback();
    });}
});
if (WebGlWorks) {
    $script("javascript/lib/threejs/three.min.js", function() {
      loadedCallback();
        $script(["javascript/lib/threejs/ColladaLoader.js", "javascript/lib/threejs/OrbitControls.js"], function() {
          loadedCallback();
            $script('javascript/3d-view.js', function() {
              loadedCallback();
              $script(["javascript/main.js"], function(){
                  loadedCallback();
              });
            });
        });
    });
}
