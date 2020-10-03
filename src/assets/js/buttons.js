document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".fixed-action-btn");
  instances = M.FloatingActionButton.init(elems, {
    direction: "left",
    hoverEnabled: false
  });
});
