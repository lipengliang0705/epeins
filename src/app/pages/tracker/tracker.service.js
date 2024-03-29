(function() {
    'use strict';
    /* globals SockJS, Stomp */

    angular
        .module('LoginsightUiApp.page.tracker')
        .factory('JhiTrackerService', JhiTrackerService);

    JhiTrackerService.$inject = ['$rootScope', '$window', '$http', '$q', 'AuthServerProvider'];

    function JhiTrackerService ($rootScope, $window, $http, $q, AuthServerProvider) {
        var stompClient = null;
        var subscriber = null;
        var listener = $q.defer();
        var connected = $q.defer();
        var alreadyConnectedOnce = false;


        var service = {
            connect: connect,
            disconnect: disconnect,
            receive: receive,
            sendActivity: sendActivity,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;

        function connect () {
            //building absolute path so that websocket doesn't fail when deploying with a context path
            var loc = $window.location;
            // var url = '//' + loc.host + loc.pathname + 'websocket/tracker';
            var url = '/' + 'websocket/tracker';
            var authToken = window.localStorage.getItem('authenticationToken');
            if(authToken){
                url += '?access_token=' + authToken;
            }
            var socket = new SockJS(url);
            stompClient = Stomp.over(socket);
            var stateChangeStart;
            var headers = {};
            stompClient.connect(headers, function() {
                connected.resolve('success');
                sendActivity();
                if (!alreadyConnectedOnce) {
                    stateChangeStart = $rootScope.$on('$stateChangeStart', function () {
                        sendActivity();
                    });
                    alreadyConnectedOnce = true;
                }
            });
            $rootScope.$on('$destroy', function () {
                if(angular.isDefined(stateChangeStart) && stateChangeStart !== null){
                    stateChangeStart();
                }
            });
        }

        function disconnect () {
            if (stompClient !== null) {
                stompClient.disconnect();
                stompClient = null;
            }
        }

        function receive () {
            return listener.promise;
        }

        function sendActivity() {
            if (stompClient !== null && stompClient.connected) {
                stompClient
                    .send('/topic/activity',
                    {});
            }
        }

        function subscribe () {
            connected.promise.then(function() {
                subscriber = stompClient.subscribe('/topic/tracker', function(data) {
                    console.log(JSON.stringify(data));
                    listener.notify(data);
                });
            }, null, null);
        }


        function unsubscribe () {
            if (subscriber !== null) {
                subscriber.unsubscribe();
            }
            listener = $q.defer();
        }
    }
})();
