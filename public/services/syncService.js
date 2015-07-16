/**
 * Created by victor on 09/07/15.
 */

(function (app) {

    'use strict';

    app.service('syncService',
        ['Offline', 'localDBService', 'dbModel', '$q', 'remotePersistenceStrategy', syncService]);


    function syncService(Offline, localDBService, dbModel, $q, remotePersistenceStrategy) {


        var syncHelper = (function () {

            return {

                check: function () {

                    var deferred = $q.defer();

                    localDBService.open(dbModel).then(function () {
                        localDBService.getCount(dbModel.objectStoreName).then(function (count) {
                            deferred.resolve(count > 0);
                        }, deferred.reject);

                    }, deferred.reject);

                    return deferred.promise;
                },

                sync: function () {

                    var deferred = $q.defer();

                    localDBService.open(dbModel).then(function () {

                        localDBService.getAll(dbModel.objectStoreName).then(function (todos) {

                            remotePersistenceStrategy.save(todos).then(function (result) {

                                if (result) {
                                    localDBService.clear(dbModel.objectStoreName).then(function () {
                                        deferred.resolve(true);
                                    }, deferred.reject);
                                } else {
                                    deferred.reject('Unable to clear local storage');
                                }

                            }, deferred.reject);

                        }, deferred.reject);

                    }, deferred.reject);

                    return deferred.promise;
                }
            };

        }());


        return {
            execute: function () {

                Offline.on('confirmed-up', function () {
                    syncHelper.check().then(function (result) {
                        if (result === true) {
                            syncHelper.sync().then(function(){
                                console.log('Data was sync successfully!');
                            }, function (err) {
                                console.error('Unable to sync data with server', err);
                            });
                        } else {
                            console.info('Nothing to sync at moment!');
                        }
                    }, function (err) {
                        console.error('Unable to check local db looking for registers no sync with server.', err);
                    });
                });
            }
        };

    }

}(app));