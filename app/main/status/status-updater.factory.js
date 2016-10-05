
angular
    .module("hwboard")
    .factory("statusUpdater", statusUpdater);


function statusUpdater($injector, $log, $timeout) {

    // -----------
    // Initialization
    // -----------

    var frequency = 2000; // How often to update.
    var _updateTimeout = undefined;
    var onStatusUpdateCallback = undefined;

    // -------------
    // Declare the API
    // -------------
    return {
        start: start,
        stop: stop,
        setOnStatusUpdate: setOnStatusUpdate
    }; // !return


    // -----------
    // Implementations
    // -----------

    function setOnStatusUpdate(callback) {
        onStatusUpdateCallback = callback;
    }

    function start() {
        _updateTimeout = $timeout(updateStatus, frequency);
    } // !start

    function stop() {
        $timeout.cancel(_updateTimeout);
    } // !stop

    function updateStatus() {
        //Weblab.dbgSetOfflineSendCommandResponse("STATE=programming");

        console.log("[DBG] Sending command");

        weblab.sendCommand("STATE")
            .done(onStatusSuccess)
            .fail(onStatusError);
    }

    function onStatusSuccess(response) {
        $log.debug("SUCCESS: STATUS: " + response);

        console.log("STATUS SUCCESS RESPONSE: ");
        console.log(response);

        if(onStatusUpdateCallback != undefined) {
            var status = response.substring(6); // Remove the "STATE=" part.
            onStatusUpdateCallback(status)
        }

        _updateTimeout = $timeout(updateStatus, frequency);
    }

    function onStatusError(error) {
        console.error("ERROR: sendCommand (status)");
        $log.error("ERROR: sendCommand (status)");
        $log.error(error);

        _updateTimeout = $timeout(updateStatus, frequency);
    }

} // !statusUpdater
