(function () {
  'use strict';

  /**
   * Timer is exactly what you think it is... A timer.
   *
   * @param {String|Number|Object} options Time expression or a option object
   * @param {Function} callback Callback to execute on tick
   * @param {Number} times Times that timer will tick
   * @constructor
   */
  Kairos.Timer = function (options, callback, times) {
    if (!options) {
      throw new Error('Invalid arguments');
    }
    
    if (!(typeof expression in ['number', 'string']) && !(options instanceof Kairos.Gnomon)) {
      this.timeout = (options.timeout instanceof Kairos.Gnomon) ? options.timeout : new Kairos.Gnomon(options.timeout);
      this.callback = options.callback || noop;
      this.times = options.times || 0;
    } else {
      this.timeout = (options instanceof Kairos.Gnomon) ? options : new Kairos.Gnomon(options);
      this.callback = callback || noop;
      this.times = times || 0;
    }
  };
  
  /**
   * @private
   */
  var _interval = null;
  
  /**
   * @private
   */
  var _onTick = function () {
    this.current++;
    if ((this.times >= this.current) || (this.current === 1 && this.isRunOnce)) {
      if (typeof this.onTickCallback === 'function') {
        this.onTickEvent();
      }
      this.callback();
    } else {
      this.stop();
    }
    if ((this.times <= this.current) || this.isRunOnce) {
      this.stop();  
    }
  };

  /**
   * @type {Kairos.Gnomon}
   * @default null
   * @protected
   */
  Kairos.Timer.prototype.timeout = null;

  /**
   * @type {Function}
   * @default function () {}
   * @protected
   */
  Kairos.Timer.prototype.callback = noop;

  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Timer.prototype.times = 0;
  
  /**
   * @type {Boolean}
   * @default false
   * @protected
   */
  Kairos.Timer.prototype.isRunOnce = false;
  
  /**
   * @type {Number}
   * @default 0
   * @protected
   */
  Kairos.Timer.prototype.current = 0;
  
  /**
   * @type {Boolean}
   * @default false
   * @protected
   */
  Kairos.Timer.prototype.running = false;
  
  /**
   * @type {Function}
   * @default function () {}
   * @protected
   */
  Kairos.Timer.prototype.onTickCallback = noop;
  
  /**
   * @type {Function}
   * @default function () {}
   * @protected
   */
  Kairos.Timer.prototype.onStartCallback = noop;
  
  /**
   * @type {Function}
   * @default function () {}
   * @protected
   */
  Kairos.Timer.prototype.onStopCallback = noop;
  
  /**
   *
   * @param {String|Number|Kairos.Gnomon} timeout
   */
  Kairos.Timer.prototype.setTimeout = function (timeout) {
    this.timeout = (timeout instanceof Kairos.Gnomon) ? timeout : new Kairos.Gnomon(timeout);
  };
  
  /**
   *
   * @returns {Kairos.Gnomon}
   */
  Kairos.Timer.prototype.getTimeout = function () {
    return this.timeout;
  };
  
  /**
   *
   * @param {Function} callback
   */
  Kairos.Timer.prototype.setCallback = function (callback) {
    this.callback = callback;
  };
  
  /**
   *
   * @returns {Function}
   */
  Kairos.Timer.prototype.getCallback = function () {
    return this.callback;
  };
  
    /**
   *
   * @param {Number} times
   */
  Kairos.Timer.prototype.setTimes = function (times) {
    this.times = times;
  };
  
  /**
   *
   * @returns {Number}
   */
  Kairos.Timer.prototype.getTimes = function () {
    return this.times;
  };
  
  /**
   *
   * @returns {Number}
   */
  Kairos.Timer.prototype.getCurrent = function () {
    return this.current;
  };
  
  /**
   *
   * @returns {Boolean}
   */
  Kairos.Timer.prototype.getRunOnce = function () {
    return this.isRunOnce;
  };
  
  /**
   * 
   * @returns {Boolean}
   */
  Kairos.Timer.prototype.isRunning = function () {
    return this.running;
  };
  
  /**
   * 
   * @param {Function} evtCallback Function to execute on tick event
   */
  Kairos.Timer.prototype.onTick = function (evtCallback) {
    this.onTickCallback = evtCallback;
  };
  
  /**
   * 
   * @param {Function} evtCallback Function to execute when timer starts
   */
  Kairos.Timer.prototype.onStart = function (evtCallback) {
    this.onStartCallback = evtCallback;
  };
  
  /**
   * 
   * @param {Function} evtCallback Function to execute when timer stops
   */
  Kairos.Timer.prototype.onStop = function (evtCallback) {
    this.onStopCallback = evtCallback;
  };
  
  /**
   * Starts the timer
   */
  Kairos.Timer.prototype.start = function () {
    if (!this.isRunning()) {
      this.current = 0;
      this.isRunOnce = false;
      this.running = true;
      _interval = setInterval(_onTick, this.timeout.getMilliseconds());
      if (typeof this.onStartCallback === 'function') {
        this.onStartCallback(new Date());
      }
    }
  };
  
  /**
   * Stops the timer
   */
  Kairos.Timer.prototype.stop = function () {
    if (this.isRunning()) {
      clearInterval(_interval);
      this.current = 0;
      this.isRunOnce = false;
      this.running = false;
      if (typeof this.onStopCallback === 'function') {
        this.onStopCallback(new Date());
      }
    }
  };
  
  /**
   * Stops the timer
   */
  Kairos.Timer.prototype.runOnce = function () {
    if (!this.isRunning()) {
      this.current = 0;
      this.isRunOnce = true;
      this.running = true;
      _interval = setInterval(_onTick, this.timeout.toMilliseconds());
    }
  };
  
  var noop = function () {};
}());