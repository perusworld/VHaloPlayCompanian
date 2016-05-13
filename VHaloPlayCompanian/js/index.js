(function () {
    "use strict";
    var playSocket = {};
    playSocket.clientSocket = null;
    playSocket.serviceNameAccept = "22122";
    WinJS.UI.Pages.define("index.html", {
        ready: function (element, options) {
            element.querySelector("#cmdSend").addEventListener("click", doSend, false);
        }
    });

    function openClient(callBack) {
        if (playSocket.clientSocket) {
            return;
        }
        var serverHostName = new Windows.Networking.HostName(document.getElementById("hostName").value);
        playSocket.clientSocket = new Windows.Networking.Sockets.StreamSocket();
        playSocket.clientSocket.connectAsync(serverHostName, playSocket.serviceNameAccept).done(function () {
            callBack();
        }, onError);
    }

    function onError(reason) {
        playSocket.clientSocket = null;
    }


    function closeSocket() {
        if (playSocket.clientSocket) {
            playSocket.clientSocket.close();
            playSocket.clientSocket = null;
        }
    }


    function sendMsg(cmd, arg, callback) {
        var writer = new Windows.Storage.Streams.DataWriter(playSocket.clientSocket.outputStream);
        var string = cmd + "," + arg;
        var len = writer.measureString(string);
        writer.writeInt32(len);
        writer.writeString(string);
        writer.storeAsync().done(function () {
            writer.detachStream();
            callback();
        }, onError);
    }

    function sendVideoID(callback) {
        sendMsg('playVideo', document.getElementById("videoId").value, callback);
    }


    function doSend() {
        openClient(function () {
            sendVideoID(function () {
                closeSocket();
            });
        });
    }


})();
