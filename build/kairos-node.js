/**
 * Kairos.js - A non date-based time calculator
 * @author Rodrigo Gomes da Silva <rodrigo.smscom@gmail.com>
 * @version v0.6.0
 * @link https://github.com/kairos
 * @license BSD
 */
(function () {
  'use strict';

  var Kairos = {};

  // global on the server, window in the browser
  var previous_Kairos;

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self || // jshint ignore:line
    typeof global === 'object' && global.global === global && global || // jshint ignore:line
    this;

  if (root !== null) { // jshint ignore:line
    previous_Kairos = root.Kairos; // jshint ignore:line
  }

  /**
   * Avoid conflict in case of another instance of Kairos is already in the scope
   *
   * @returns {Object}
   */
  Kairos.noConflict = function () {
    root.Kairos = previous_Kairos;
    return Kairos;
  };

  /**
   * Sums augend time with addend time
   *
   * @param {String|Number} augend Augend time expression
   * @param {String|Number} addend Addend time expression
   */
  Kairos.plus = function (augend, addend) {
    var a = new Kairos.Gnomon(augend);
    var b = new Kairos.Gnomon(addend);
    a.plus(b);
    return a.toExpression();
  };

  /**
   * Subtracts minuend time with subtrahend time
   *
   * @param {String|Number} minuend Minuend time expression
   * @param {String|Number} subtrahend Subtrahend time expression
   * @returns {String}
   */
  Kairos.minus = function (minuend, subtrahend) {
    var a = new Kairos.Gnomon(minuend);
    var b = new Kairos.Gnomon(subtrahend);
    a.minus(b);
    return a.toExpression();
  };

  /**
   * Multiplies multiplier by the multiplicand
   *
   * @param {String|Number} multiplier Multiplier time expression
   * @param {String|Number} multiplicand Multiplicand number
   * @returns {String}
   */
  Kairos.multiply = function (multiplier, multiplicand) {
    var m = new Kairos.Gnomon(multiplier);
    m.multiply(multiplicand);
    return m.toExpression();
  };

  /**
   * Divides dividend by the divisor
   *
   * @param {String|Number} dividend Dividend time expression
   * @param {Number} divisor Dividor number
   * @returns {String}
   */
  Kairos.divide = function (dividend, divisor) {
    var d = new Kairos.Gnomon(dividend);
    d.divide(divisor);
    return d.toExpression();
  };

  /**
   *
   * @param {String|Number} time
   * @param {Number} numerator
   * @param {Number} denominator
   * @returns {String}
   */
  Kairos.getFraction = function (time, numerator, denominator) {
    if (numerator > denominator) {
      throw new Error('Improper fraction');
    }

    var gnomon = new Kairos.Gnomon(time);
    gnomon.multiply(numerator);
    gnomon.divide(denominator);
    return gnomon.toExpression();
  };
  
  /**
   * Returns a time expression representing the time between starting time and ending time
   * 
   * @param {String|Number} time1 time expression representing the starting time
   * @param {String|Number} time2 time expression representing the ending time
   * @returns {String}
   */
  Kairos.getInterval = function (starting, ending) {
    var st = new Kairos.Gnomon(starting);
    var en = new Kairos.Gnomon(ending);
    if (st.compareTo(en) > 0) {
      throw new Error('Starting time must be bigger than ending time');
    }
    
    en.minus(st);
    return en.toExpression();
  };

  /**
   * Converts the given time expression to milliseconds
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMilliseconds = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toMilliseconds();
  };

  /**
   * Converts the given time expression to seconds
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toSeconds = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toSeconds();
  };

  /**
   * Converts the given time expression to minutes
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toMinutes = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toMinutes();
  };

  /**
   * Converts the given time expression to hours
   *
   * @param {String|Number} expression Time expression
   * @returns {Number}
   */
  Kairos.toHours = function (expression) {
    var gnomon = new Kairos.Gnomon(expression);
    return gnomon.toHours();
  };
  
  /**
   * Compares first time with second time and returns -1, 0 or 1 if first value
   * is smaller, equals or bigger than second value
   * 
   * @param {String|Number} time1 Time expression
   * @param {String|Number} time2 Time expression for comparation
   * @returns {Number}
   */
  Kairos.compareTo = function (time1, time2) {
    var a = new Kairos.Gnomon(time1);
    var b = new Kairos.Gnomon(time2);
    return a.compareTo(b);
  };
  
  /**
   * Returns the minimum value from the given values
   * 
   * @param {String[]|Number[]|Kairos.Gnomon[]} values Array with time expressions
   * @returns {String}
   */
  Kairos.min = function (values) {
    if (!(values instanceof Array)) {
      values = Array.prototype.slice.call(arguments);
    }
    
    var min = values.reduce(function (previous, current) {
      if (!(previous instanceof Kairos.Gnomon)) {
        previous = new Kairos.Gnomon(previous);
      }
      if (!(current instanceof Kairos.Gnomon)) {
        current = new Kairos.Gnomon(current);
      }
      return ( previous.toMilliseconds() < current.toMilliseconds() ? previous : current );
    });
    
    return min.toExpression();
  };
  
  /**
   * Returns the maximum value from the given values
   * 
   * @param {String[]|Number[]|Kairos.Gnomon[]} values Array with time expressions
   * @returns
   */
  Kairos.max = function (values) {
    if (!(values instanceof Array)) {
      values = Array.prototype.slice.call(arguments);
    }
    
    var max = values.reduce(function (previous, current) {
      if (!(previous instanceof Kairos.Gnomon)) {
        previous = new Kairos.Gnomon(previous);
      }
      if (!(current instanceof Kairos.Gnomon)) {
        current = new Kairos.Gnomon(current);
      }
      return ( previous.toMilliseconds() > current.toMilliseconds() ? previous : current );
    });
    
    return max.toExpression();
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    (function () {
      'use strict';
    
      /**
       *
       * @type {{SECOND: number, MINUTE: number, HOUR: number}}
       */
      var MILLIS = {
        SECOND: 1000,
        MINUTE: 60 * 1000,
        HOUR: 60 * 60 * 1000
      };
    
      /**
       * Gnomon is the time engine for Kairos. It's name references the first solar clock ever made.
       *
       * @param {String|Number} expression Time expression
       * @constructor
       */
      Kairos.Gnomon = function (expression) {
        if (typeof expression === 'number') {
    
          this.milliseconds = expression;
    
        } else if (typeof expression === 'string' && expression.length > 0) {
    
          var timeSteps = expression.split(':');
          var positive = expression.slice(0, 1)[0] !== '-';
    
          for (var i = 0, len = timeSteps.length; i < len; i++) {
            var timeStep = timeSteps[i];
    
            if (!isNaN(timeStep)) {
              timeStep = Math.abs(timeStep);
              switch (i) {
                case 0:
                  this.milliseconds = _parse(this, MILLIS.HOUR, timeStep);
                  break;
                case 1:
                  this.milliseconds = _parse(this, MILLIS.MINUTE, timeStep);
                  break;
                case 2:
                  this.milliseconds = _parse(this, MILLIS.SECOND, timeStep);
                  break;
                case 3:
                  this.milliseconds = _parse(this, 1, timeStep);
                  break;
                default:
                  throw new Error('Invalid time expression');
              }
            } else {
              throw new Error('Time step is not a number');
            }
          }
          if (!positive) {
            this.milliseconds = -Math.abs(this.milliseconds);
          }
    
        }
      };
    
      /**
       * @param {Kairos.Gnomon} instance
       * @param {Number} millis
       * @param {Number} time
       * @returns {Number}
       * @private
       */
      var _parse = function (instance, millis, time) {
        switch (millis) {
          case 1:
            instance.removeMilliseconds(instance.getMilliseconds());
            break;
          case MILLIS.SECOND:
            instance.removeSeconds(instance.getSeconds());
            break;
          case MILLIS.MINUTE:
            instance.removeMinutes(instance.getMinutes());
            break;
          case MILLIS.HOUR:
            instance.removeHours(instance.getHours());
            break;
        }
        return instance.milliseconds + (time * millis);
      };
    
      /**
       * @type {Number}
       * @default 0
       * @protected
       */
      Kairos.Gnomon.prototype.milliseconds = 0;
    
      /**
       *
       * @param {Number} hours
       */
      Kairos.Gnomon.prototype.setHours = function (hours) {
        this.milliseconds = _parse(this, MILLIS.HOUR, hours);
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getHours = function () {
        return parseInt(this.milliseconds / MILLIS.HOUR);
      };
    
      /**
       *
       * @param {Number} minutes
       */
      Kairos.Gnomon.prototype.setMinutes = function (minutes) {
        this.milliseconds = _parse(this, MILLIS.MINUTE, minutes);
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getMinutes = function () {
        return parseInt(parseInt(this.milliseconds - (parseInt(this.toHours()) * MILLIS.HOUR)) / MILLIS.MINUTE);
      };
    
      /**
       *
       * @param {Number} seconds
       */
      Kairos.Gnomon.prototype.setSeconds = function (seconds) {
        this.milliseconds = _parse(this, MILLIS.SECOND, seconds);
      };
    
      /**
       *
       * @returns {*|Number}
       */
      Kairos.Gnomon.prototype.getSeconds = function () {
        return parseInt(parseInt(this.milliseconds - (parseInt(this.toMinutes()) * MILLIS.MINUTE)) / MILLIS.SECOND);
      };
    
      /**
       *
       * @param {Number} milliseconds
       */
      Kairos.Gnomon.prototype.setMilliseconds = function (milliseconds) {
        this.milliseconds = _parse(this, 1, milliseconds);
      };
    
      /**
       *
       * @returns {Number|*}
       */
      Kairos.Gnomon.prototype.getMilliseconds = function () {
        return parseInt(this.milliseconds - (parseInt(this.toSeconds()) * MILLIS.SECOND));
      };
    
      /**
       *
       * @param {Number} hours
       */
      Kairos.Gnomon.prototype.addHours = function (hours) {
        this.milliseconds += (MILLIS.HOUR * hours);
      };
    
      /**
       *
       * @param {Number} minutes
       */
      Kairos.Gnomon.prototype.addMinutes = function (minutes) {
        this.milliseconds += (MILLIS.MINUTE * minutes);
      };
    
      /**
       *
       * @param {Number} seconds
       */
      Kairos.Gnomon.prototype.addSeconds = function (seconds) {
        this.milliseconds += (MILLIS.SECOND * seconds);
      };
    
      /**
       *
       * @param {Number} milliseconds
       */
      Kairos.Gnomon.prototype.addMilliseconds = function (milliseconds) {
        this.milliseconds += milliseconds;
      };
    
      /**
       *
       * @param {Number} hours
       */
      Kairos.Gnomon.prototype.removeHours = function (hours) {
        this.milliseconds -= (MILLIS.HOUR * hours);
      };
    
      /**
       *
       * @param {Number} minutes
       */
      Kairos.Gnomon.prototype.removeMinutes = function (minutes) {
        this.milliseconds -= (MILLIS.MINUTE * minutes);
      };
    
      /**
       *
       * @param {Number} seconds
       */
      Kairos.Gnomon.prototype.removeSeconds = function (seconds) {
        this.milliseconds -= (MILLIS.SECOND * seconds);
      };
    
      /**
       *
       * @param {Number} milliseconds
       */
      Kairos.Gnomon.prototype.removeMilliseconds = function (milliseconds) {
        this.milliseconds -= milliseconds;
      };
    
      /**
       *
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.toHours = function () {
        return (this.milliseconds / MILLIS.HOUR);
      };
    
      /**
       *
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.toMinutes = function () {
        return (this.milliseconds / MILLIS.MINUTE);
      };
    
      /**
       *
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.toSeconds = function () {
        return (this.milliseconds / MILLIS.SECOND);
      };
    
      /**
       *
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.toMilliseconds = function () {
        return this.milliseconds;
      };
    
      /**
       *
       * @returns {String}
       */
      Kairos.Gnomon.prototype.toExpression = function () {
        var expression = '';
        // Hours
        expression += ('00' + parseInt(Math.abs(this.getHours()))).slice(-2) + ':';
        // Minutes
        expression += ('00' + parseInt(Math.abs(this.getMinutes()))).slice(-2);
        // Seconds
        if (this.getSeconds() !== 0 || this.getMilliseconds() !== 0) {
          expression += ':' + ('00' + parseInt(Math.abs(this.getSeconds()))).slice(-2);
        }
        // Millis
        if (this.getMilliseconds() !== 0) {
          expression += ':' + ('000' + parseInt(Math.abs(this.getMilliseconds()))).slice(-3);
        }
    
        if (this.milliseconds < 0) {
          expression = '-' + expression;
        }
        return expression;
      };
    
      /**
       *
       * @param {Kairos.Gnomon} addend
       */
      Kairos.Gnomon.prototype.plus = function (addend) {
        this.milliseconds += addend.toMilliseconds();
      };
    
      /**
       *
       * @param {Kairos.Gnomon} subtrahend
       */
      Kairos.Gnomon.prototype.minus = function (subtrahend) {
        this.milliseconds -= subtrahend.toMilliseconds();
      };
    
      /**
       *
       * @param {Number} multiplicand
       */
      Kairos.Gnomon.prototype.multiply = function (multiplicand) {
        this.milliseconds *= multiplicand;
      };
    
      /**
       *
       * @param {Number} dividend
       */
      Kairos.Gnomon.prototype.divide = function (dividend) {
        this.milliseconds /= dividend;
      };
      
      /**
       * Compares with another instance.
       * Smaller  -1
       * Equals   0
       * Bigger   1
       * 
       * @param {Kairos.Gnomon} another
       * @returns {Number}
       */
      Kairos.Gnomon.prototype.compareTo = function (another) {
        if (this.milliseconds < another.toMilliseconds()) {
          return -1;
        }
        if (this.milliseconds === another.toMilliseconds()) {
          return 0;
        }
        if (this.milliseconds > another.toMilliseconds()) {
          return 1;
        }
      };
    }());
    module.exports = Kairos;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) { // jshint ignore:line
    define([], function () { // jshint ignore:line
      return Kairos;
    });
  }
  // included directly via <script> tag
  else {
    root.Kairos = Kairos;
  }
}());