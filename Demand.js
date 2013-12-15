/* class Demand(string url [, object options ]) */
function Demand(url, options) {

	// Error checking

	// url has to be string
	if (typeof url !== 'string') {
		console.error("Can't issue Demand without a proper url parameter.");
		return false;
	}

	// options, if set, has to be an object
	if (typeof options !== 'undefined' && typeof options !== 'object') {
		console.error('`options` set but is not an object.');
		return false;
	}


	var self = this;

	this.url = url;
	this.xhr = new XMLHttpRequest();
	this.events = {};

	if (typeof options === 'object') {

		// loop through options object and add any functions to event list
		for (var i in options) {
			if (options.hasOwnProperty(i) === false || typeof options[i] !== 'function') continue;

			this.on(i, options[i]);
		}
	}


	// check if browser has upload support
	if (this.xhr.upload) {
		// upload progress
		this.xhr.upload.addEventListener('progress', function(ev) {
			self.trigger('uploadprogress', this, ev);
		});
	}

	// download progress
	this.xhr.addEventListener('progress', function(ev) {
		self.trigger('progress', this, ev);
	});

	this.xhr.addEventListener('readystatechange', function(ev) {
		// this === self.xhr in this context

		if (this.readyState === 4) {
			self.trigger('complete', this, ev);

			if (this.status >= 200 && this.status < 300) self.trigger('success', this, ev);
			else self.trigger('failure', this, ev);
		}
	});

	this.xhr.addEventListener('abort', function(ev) {
		self.trigger('abort', this, ev);
	});
};


/* void head()
	Demands a HEAD response
*/
Demand.prototype.head = function() {
	this.xhr.open('HEAD', this.url, true);
	this.xhr.send(null);
}

/* void options()
	Demands a OPTIONS response
*/
Demand.prototype.options = function() {
	this.xhr.open('OPTIONS', this.url, true);
	this.xhr.send(null);
}

/* void get()
	Demands a GET response
*/
Demand.prototype.get = function() {
	this.xhr.open('GET', this.url, true);
	this.xhr.send(null);
}

/* void post()
	Demands a POST response
*/
Demand.prototype.post = function(data) {
	this.xhr.open('POST', this.url, true);
	this.xhr.send(data);
}

/* void put()
	Demands a PUT response
*/
Demand.prototype.put = function() {
	this.xhr.open('PUT', this.url, true);
	this.xhr.send();
}

/* void delete()
	Demands a DELETE response
*/
Demand.prototype.delete = function() {
	this.xhr.open('DELETE', this.url, true);
	this.xhr.send();
}

/* void raw(string method [ , mixed data [, bool asynchronous ] ])
	YOU'RE in charge!
*/
Demand.prototype.raw = function(method, data, asynchronous) {
	if (typeof method !== 'string') return false;
	if (typeof data === 'undefined') data = null;
	if (typeof asynchronous === 'undefined') asynchronous = true;
	else if (typeof asynchronous !== 'boolean') return false;

	this.xhr.open(method, this.url, asynchronous);
	this.xhr.send(data);
}

/* void abort()
	Aborts current demand
*/
Demand.prototype.abort = function() {
	this.xhr.abort();
}

/* void on(string name, function f)
	binds function to event
*/
Demand.prototype.on = function(name, f) {
	if (typeof f !== 'function') return false;
	
	this.events[name] = f;
};

/* void trigger(string name)
	trigger all functions bound to event
*/
Demand.prototype.trigger = function(name) {
	if (typeof this.events[name] === 'undefined') return false;

	var args = Array.prototype.slice.call(arguments, 1); // remove name argument
	this.events[name].apply(this.xhr, args); // bind xhr object and any arguments
};