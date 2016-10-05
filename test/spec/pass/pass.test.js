'use strict';

var $q;
var $timeout;

// WeblabExp mock (weblab.v1.js)
var WeblabExp = function() {
    var _cmd = "";
    var _result = "";

    this.dbgSetOfflineSendCommandResponse = function(cmd, result) {
        _cmd = cmd;
        if(result == undefined)
            result = true;
        _result = result;
    };

    this.sendCommand = function(cmd, success, failure) {
        if(_result) {
            success(_cmd);
        }
        if(!_result)
            failure(_cmd);
    };

    this.onConfigLoad = function() {

    };
};

var weblab = new WeblabExp();

describe('Always-pass test', function () {

    // load the controller's module
    beforeEach(module('hwboard'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$q_, _$timeout_) {
        $timeout = _$timeout_;
        $q = _$q_;
    }));

    it('should pass', function () {
        expect(3).toBe(3);
    });

});
