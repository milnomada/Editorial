/*
 * Ga version 0.1
 * Basic event implementation
 */

// defaults
var __ga, gaTimeout = 1050;

function GaSuite() {
  this.active = false
  if('ga' in window) {
    this.__tr = ga.getAll()[0];
    if(!this.__tr) {
      this.__tr = {
        send: function(){ /* fake send */ }
      }
    } else this.active = true
  } else {
    var _this = this
    setTimeout(function(){
      if('ga' in window) {
        _this.__tr = ga.getAll()[0];
        if(_this.__tr)
          _this.active = true
      }
    }, gaTimeout);
  }
} 

GaSuite.prototype.sendEvent = function(category, action, label, value){ 
  if(!this.active) 
    console.warn("GaSuite not active")
  else
    this.__tr.send('event', category, action, label, value)      
}
