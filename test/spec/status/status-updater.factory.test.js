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



describe('Factory: statusUpdater', function () {

    // load the controller's module
    beforeEach(module('hwboard'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_statusUpdater_, _$q_, _$timeout_) {
        statusUpdater = _statusUpdater_;
        $timeout = _$timeout_;
        $q = _$q_;
    }));

    it('should pass', function () {
        expect(3).toBe(3);
    });

    it('should call callback just after starting', function(done) {
        expect(statusUpdater).toBeDefined();

        statusUpdater.setOnStatusUpdate(onStatusUpdateSimple);

        statusUpdater.start();

        $timeout.flush();

        // --------------
        // Implementations
        // --------------

        function onStatusUpdateSimple(status) {
            done();
        } // !onStatusUpdate
    });

    /**
     * Currently slightly ugly because we need to do real timeouts for $timeout.flush to work.
     * TODO: Fix that somehow.
     */
    it('should call callback after a while through $timeout', function(done) {
        expect(statusUpdater).toBeDefined();

        statusUpdater.setOnStatusUpdate(onStatusUpdateDeferred);

        statusUpdater.start();

        var times_called = 0;

        $timeout.flush();

        // ---------------
        // Implementations
        // ---------------

        function onStatusUpdateDeferred(status) {
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

    it('should report a "programming" test status', function(done) {
        expect(statusUpdater).toBeDefined();

        statusUpdater.setOnStatusUpdate(onStatusUpdateCheck);

        statusUpdater.start();

        $timeout.flush();

        // ---------------
        // Implementations
        // ---------------

        function onStatusUpdateCheck(status) {
            expect(status).toBeDefined();
            expect(status).toEqual(jasmine.any(String));
            expect(status).toBe("programming");
            done();
        }
    });

});
