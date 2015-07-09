/**
 * Created by victor on 08/07/15.
 */

(function(app){

    'use strict';

    app.factory('remotePersistenceStrategy', ['$q', '$http', remotePersistenceStrategy]);

    function remotePersistenceStrategy($q, $http){

        var svc = {
            save: function(todo){

                var deferred = $q.defer();

                $http.post('/api/todos', todo)
                    .then(deferred.resolve, deferred.reject);

                return deferred.promise;

            },
            getAll: function() {

                var deferred = $q.defer();

                $http.get('/api/todos')
                    .then(deferred.resolve, deferred.reject);

                return deferred.promise;

            },
            getById: function(id) {

                var deferred = $q.defer();

                $http.get('/api/todos/' + id)
                    .then(deferred.resolve, deferred.reject);

                return deferred.promise;
            }
        };

        return svc;

    }

    app.factory('localPersistenceStrategy', ['$q', 'localDBService', 'nullTodo', 'dbModel', localPersistenceStrategy]);

    function localPersistenceStrategy($q, localDBService, nullTodo, dbModel){

        var svc = {

            dbModel: dbModel,
            localDBService: localDBService,

            save: function(todo) {

                var deferred = $q.defer();

                localDBService.open(svc.dbModel).then(function() {

                    var id = todo.id;

                    if (id === null || id === undefined){

                        localDBService.insert(svc.dbModel.objectStoreName, todo, 'id')
                            .then(deferred.resolve, deferred.reject);

                    } else {

                        svc.exists(id).then(function(doesExists){
                            if(doesExists){
                                localDBService.update(svc.dbModel.objectStoreName, todo, id)
                                    .then(deferred.resolve, deferred.reject);
                            } else {
                                localDBService.insert(svc.dbModel.objectStoreName, todo, 'id')
                                    .then(deferred.resolve, deferred.reject);
                            }
                        }, deferred.reject);

                    }

                }, deferred.reject);

                return deferred.promise;
            },

            getAll: function() {

                var deferred = $q.defer();

                localDBService.open(svc.dbModel).then(function(){

                    localDBService.getAll(svc.dbModel.objectStoreName)
                        .then(deferred.resolve, deferred.reject);

                }, deferred.reject);

                return deferred.promise;
            },

            getById: function(id) {

                var deferred = $q.defer();

                localDBService.open(svc.dbModel).then(function() {
                    localDBService.getById(svc.dbModel.objectStoreName, id)
                        .then(deferred.resolve, deferred.reject);
                }, deferred.reject);

                return deferred.promise;

            },

            exists: function(id) {

                var deferred = $q.defer();

                svc.getById(id).then(function(todo){
                    deferred.resolve(todo.id === id);
                }, deferred.reject);

                return deferred.promise;
            }

        };

        return svc;

    }

}(app));