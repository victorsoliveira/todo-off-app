/**
 * Created by victor on 08/07/15.
 */
(function(app){

    'use strict';

    app.service('persistenceService',
        ['$q', 'Offline', 'remotePersistenceStrategy', 'localPersistenceStrategy', 'syncService', persistenceService]);

    function persistenceService($q, Offline, remotePersistenceStrategy, localPersistenceStrategy, syncService){

        var self = this;

        self.persistenceType = 'remote';
        self.action = remotePersistenceStrategy;


        Offline.on('confirmed-up', function() {

            self.persistenceType = 'remote';
            self.action = remotePersistenceStrategy;

            //sync local data with server
            syncService.execute();
        });

        Offline.on('confirmed-down', function(){
            self.persistenceType = 'local';
            self.action = localPersistenceStrategy;
        });

        self.getLocalTodo = function(id) {
            return localPersistenceStrategy.getById(id);
        };

        self.getRemoteTodo = function(id){
            return remotePersistenceStrategy.getById(id);
        };

        self.getById = function(id){

            var deferred = $q.defer();

            if (Offline.state === 'up'){

                var remoteTodo = {},
                    localTodo = {};

                self.getRemoteTodo(id).then(function(rTodo){

                    remoteTodo = rTodo;

                    self.getLocalTodo(id).then(function(lTodo){

                        localTodo = lTodo;

                        if (lTodo.modifiedDate > (new Date(rTodo.modifiedDate))){
                            deferred.resolve(localTodo);
                        } else {
                            deferred.resolve(remoteTodo);
                        }

                    }, deferred.reject);

                }, deferred.reject);

            } else {
              self.getLocalTodo(id).then(deferred.resolve, deferred.reject);
            }

            return deferred.promise;

        };

        return self;
    }


}(app));