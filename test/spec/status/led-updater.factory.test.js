'use strict';

var $q;
var $timeout;


var weblab = new WeblabExp();

weblab.dbgSetFakeServer(getFakeServerObject());
weblab.enableDebuggingMode();;

function getFakeServerObject() {
    return {
        start: function () {
            return "";
        },

        sendCommand: function (cmd) {
            // WARNING: No idea why, but invoking the $log function BLOCKS THE JAVASCRIPT THREAD FOREVER
            // and results in a particularly non-intuitive timeout in the tests.
            // $log.debug("[FakeServer]: Received command: " + cmd);

            return "STATE=programming";
        }
    };
} // !getFakeServerObject

describe('Factory: ledUpdater', function () {

    // load the controller's module
    beforeEach(module('hwboard'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_ledUpdater_, _$q_, _$timeout_) {
        ledUpdater = _ledUpdater_;
        $timeout = _$timeout_;
        $q = _$q_;
    }));

    it('should pass', function () {
        expect(3).toBe(3);
    });

    it('should call callback just after starting', function(done) {
        expect(statusUpdater).toBeDefined();

        ledUpdater.setOnLedUpdate(onLedUpdateSimple);

        ledUpdater.start();

        $timeout.flush();

        // --------------
        // Implementations
        // --------------

        function onLedUpdateSimple(status) {
            done();
        } // !onStatusUpdate
    });


    /**
     * TODO: Does not work without a real timeout, which should actually be avoided.
     */
    it('should call callback after a while through $timeout', function(done) {
        expect(ledUpdater).toBeDefined();

        ledUpdater.setOnLedUpdate(onLedUpdateDeferred);

        ledUpdater.start();

        var times_called = 0;

        $timeout.flush();

        // ---------------
        // Implementations
        // ---------------

        function onLedUpdateDeferred(status) {
            times_called += 1;

            if(times_called > 1) {
                done();
            }
            else {
                // We need to invoke the next flush in a real timeout, because otherwise the fake
                // server has not returned a response for weblab.sendCommand, and there is thus no timeout
                // to flush yet.
                setTimeout(function () {
                    try {
                        $timeout.flush();
                    } catch (ex) {
                        console.log(ex);
                    }
                }, 550);
            }
        } // !onStatusUpdate
    });

    /**
     * TODO: Ensure this test actually tests anything.
     */
    it('should provide some response to the led status check', function(done) {
        expect(ledUpdater).toBeDefined();

        ledUpdater.setOnLedUpdate(onLedUpdateCheck);

        ledUpdater.start();

        $timeout.flush();

        // ---------------
        // Implementations
        // ---------------

        function onLedUpdateCheck(status) {
            expect(status).toBeDefined();
            expect(status).toEqual(jasmine.any(String));
            //expect(status).toBe("programming");
            done();
        }
    });

});
