/**
 * Kairos.js - A time calculator library
 * @author Rodrigo Gomes da Silva <rodrigo.smscom@gmail.com>
 * @version v0.4.0
 * @link https://github.com/kairos
 * @license BSD
 */
var Kairos={};!function(){"use strict";var o,n="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this;null!==n&&(o=n.Kairos),Kairos.noConflict=function(){return void 0,n.Kairos=o,Kairos},Kairos.plus=function(o,n){var r=new Kairos.Gnomon(o),i=new Kairos.Gnomon(n);return r.plus(i),r.toExpression()},Kairos.minus=function(o,n){var r=new Kairos.Gnomon(o),i=new Kairos.Gnomon(n);return r.minus(i),r.toExpression()},Kairos.multiply=function(o,n){var r=new Kairos.Gnomon(o);return r.multiply(n),r.toExpression()},Kairos.divide=function(o,n){var r=new Kairos.Gnomon(o);return r.divide(n),r.toExpression()},Kairos.getFraction=function(o,n,r){if(n>r)throw new Error("Improper fraction");var i=new Kairos.Gnomon(o);return i.multiply(n),i.divide(r),i.toExpression()},Kairos.toMilliseconds=function(o){var n=new Kairos.Gnomon(o);return n.toMilliseconds()},Kairos.toSeconds=function(o){var n=new Kairos.Gnomon(o);return n.toSeconds()},Kairos.toMinutes=function(o){var n=new Kairos.Gnomon(o);return n.toMinutes()},Kairos.toHours=function(o){var n=new Kairos.Gnomon(o);return n.toHours()},"object"==typeof module&&module.exports?module.exports=Kairos:"function"==typeof define&&define.amd?define([],function(){return Kairos}):n.Kairos=Kairos}();
!function(){"use strict";var o={SECOND:1e3,MINUTE:6e4,HOUR:36e5};Kairos.Gnomon=function(i){if("number"==typeof i)this.milliseconds=i;else if("string"==typeof i&&i.length>0){for(var t=i.split(":"),n="-"!==i.slice(0,1)[0],e=0,r=t.length;r>e;e++){var l=t[e];if(isNaN(l))throw new Error("Time step is not a number");switch(l=Math.abs(l),e){case 0:this.milliseconds=s(this,o.HOUR,l);break;case 1:this.milliseconds=s(this,o.MINUTE,l);break;case 2:this.milliseconds=s(this,o.SECOND,l);break;case 3:this.milliseconds=s(this,1,l);break;default:throw new Error("Invalid time expression")}}n||(this.milliseconds=-Math.abs(this.milliseconds))}};var s=function(s,i,t){switch(i){case 1:s.removeMilliseconds(s.getMilliseconds());break;case o.SECOND:s.removeSeconds(s.getSeconds());break;case o.MINUTE:s.removeMinutes(s.getMinutes());break;case o.HOUR:s.removeHours(s.getHours())}return s.milliseconds+t*i};Kairos.Gnomon.prototype.milliseconds=0,Kairos.Gnomon.prototype.setHours=function(i){this.milliseconds=s(this,o.HOUR,i)},Kairos.Gnomon.prototype.getHours=function(){return parseInt(this.milliseconds/o.HOUR)},Kairos.Gnomon.prototype.setMinutes=function(i){this.milliseconds=s(this,o.MINUTE,i)},Kairos.Gnomon.prototype.getMinutes=function(){return parseInt(parseInt(this.milliseconds-parseInt(this.toHours())*o.HOUR)/o.MINUTE)},Kairos.Gnomon.prototype.setSeconds=function(i){this.milliseconds=s(this,o.SECOND,i)},Kairos.Gnomon.prototype.getSeconds=function(){return parseInt(parseInt(this.milliseconds-parseInt(this.toMinutes())*o.MINUTE)/o.SECOND)},Kairos.Gnomon.prototype.setMilliseconds=function(o){this.milliseconds=s(this,1,o)},Kairos.Gnomon.prototype.getMilliseconds=function(){return parseInt(this.milliseconds-parseInt(this.toSeconds())*o.SECOND)},Kairos.Gnomon.prototype.addHours=function(s){this.milliseconds+=o.HOUR*s},Kairos.Gnomon.prototype.addMinutes=function(s){this.milliseconds+=o.MINUTE*s},Kairos.Gnomon.prototype.addSeconds=function(s){this.milliseconds+=o.SECOND*s},Kairos.Gnomon.prototype.addMilliseconds=function(o){this.milliseconds+=o},Kairos.Gnomon.prototype.removeHours=function(s){this.milliseconds-=o.HOUR*s},Kairos.Gnomon.prototype.removeMinutes=function(s){this.milliseconds-=o.MINUTE*s},Kairos.Gnomon.prototype.removeSeconds=function(s){this.milliseconds-=o.SECOND*s},Kairos.Gnomon.prototype.removeMilliseconds=function(o){this.milliseconds-=o},Kairos.Gnomon.prototype.toHours=function(){return this.milliseconds/o.HOUR},Kairos.Gnomon.prototype.toMinutes=function(){return this.milliseconds/o.MINUTE},Kairos.Gnomon.prototype.toSeconds=function(){return this.milliseconds/o.SECOND},Kairos.Gnomon.prototype.toMilliseconds=function(){return this.milliseconds},Kairos.Gnomon.prototype.toExpression=function(){var o="";return o+=("00"+parseInt(Math.abs(this.getHours()))).slice(-2)+":",o+=("00"+parseInt(Math.abs(this.getMinutes()))).slice(-2),(0!==this.getSeconds()||0!==this.getMilliseconds())&&(o+=":"+("00"+parseInt(Math.abs(this.getSeconds()))).slice(-2)),0!==this.getMilliseconds()&&(o+=":"+("000"+parseInt(Math.abs(this.getMilliseconds()))).slice(-3)),this.milliseconds<0&&(o="-"+o),o},Kairos.Gnomon.prototype.plus=function(o){this.milliseconds+=o.toMilliseconds()},Kairos.Gnomon.prototype.minus=function(o){this.milliseconds-=o.toMilliseconds()},Kairos.Gnomon.prototype.multiply=function(o){this.milliseconds*=o},Kairos.Gnomon.prototype.divide=function(o){this.milliseconds/=o}}();