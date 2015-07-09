/**
 * Created by victor on 08/07/15.
 */
(function(app){

    'use strict';

    app.controller('todoCtrl', ['$scope', '_', 'persistenceService', 'Offline', todoCtrl]);

    function todoCtrl($scope, _, persistenceService, Offline) {

        $scope.todos = [];
        $scope.todo = {};

        $scope.add = function(){
            persistenceService.action.save($scope.todo).then(
                function(){
                    $scope.todo = {};
                    lazyGetData();
                },
                function(err){
                    $scope.error = err;
                }
            );
        };

        var getData = function() {
            persistenceService.action.getAll().then(
                function(todos) {
                    $scope.todos = todos.data || todos;
                },
                function(err) {
                    $scope.error = err;
                }
            );
        };

        var lazyGetData = _.debounce(getData, 50);

        Offline.on('confirmed-down', lazyGetData);
        Offline.on('confirmed-up', lazyGetData);

        lazyGetData();
    }

}(app));