Demand
======

Don't make requests - make Demands!
-----------------------------------

Demand.js is a lightweight XMLHttpRequest wrapper with which you can demand resources from servers.

```javascript
// Use it this way:

var demand = new Demand('/url', {
  success: function(xhr) {},
  failure: function(xhr) {},
  complete: function(xhr) {}
});

demand.get();

// or like this:

var demand = new Demand('/url');
demand.on('success', function(xhr) {});
demand.on('failure', function(xhr) {});
demand.on('complete', function(xhr) {});
demand.get();
```

Methods
-------

`get(void)`  
`post(string | object | FormData)`  
`put(string | object | FormData)`  
`delete(void)`  
`head(void)`  
`options(void)`  

`raw(string method, mixed data, bool asynchronous)`  

`abort()`
`on(string name, function f)`

Events
------

`success`  
`failure`  
`complete`  
`uploadprogress`  
`progress`  
`abort`  