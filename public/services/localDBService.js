/**
 * Created by victor on 08/07/15.
 */

(function (app, undefined) {

    'use strict';

    app.service('localDBService', ['$q', 'indexedDB', 'uuid', localDBService]);

    function localDBService($q, indexedDB, uuid) {

        var _error = {

            setErrorHandlers: function(request, errorHandler) {

                if(request !== undefined){
                    if ('onerror' in request) request.onerror = errorHandler;
                    if ('onblocked' in request) request.onerror = errorHandler;
                    if ('onabort' in request) request.onerror = errorHandler;
                }

            }
        };

        var _db = {

            instance: null,

            transactionTypes: {
                readonly: 'readonly',
                readwrite: 'readwrite'
            },

            open: function(databaseModel) {

                var deferred = $q.defer();
                var request = indexedDB.open(databaseModel.name, databaseModel.version);

                _error.setErrorHandlers(request, deferred.reject);

                request.onupgradeneeded = databaseModel.upgrade;

                request.onsuccess = function(e) {
                    _db.instance = e.target.result;
                    _error.setErrorHandlers(_db.instance, deferred.reject);
                    deferred.resolve();
                };

                return deferred.promise;

            },

            requireOpenDB: function(objectStoreName, deferred) {
                if(_db.instance === null){
                    deferred.reject('You cannot use an object store when database is not opened. ObjectStoreName = ' + objectStoreName)
                }
            },

            getObjectStore: function(objectStoreName, mode) {

                var mode = mode || _db.transactionTypes.readonly;
                var txn = _db.instance.transaction(objectStoreName, mode);
                var store = txn.objectStore(objectStoreName);

                return store;
            },

            requireObjectStoreName: function(objectStoreName, deferred) {

                if (objectStoreName === undefined || !objectStoreName || objectStoreName.length === 0){
                    deferred.reject('An ObjectStoreNme is required');
                }
            },

            getCount: function(objectStoreName) {

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName);
                var request = store.count();
                var count;

                request.onsuccess = function(e) {
                    count = e.target.result;
                    deferred.resolve(count);
                };

                return deferred.promise;
            },

            getAll: function(objectStoreName) {

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName);
                var cursor = store.openCursor();
                var data = [];

                cursor.onsuccess = function(e) {

                    var result = e.target.result;

                    if(result && result !== null){
                        data.push(result.value);
                        result.continue();
                    } else {
                        deferred.resolve(data);
                    }

                };

                return deferred.promise;

            },

            insert: function(objectStoreName, data, keyName) {

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
                var request;

                var date = new Date();

                data.insertDate = date;
                data.modificatedDate = date;

                if(!data[keyName]){
                    data[keyName] = uuid.v4();
                }

                request = store.add(data);

                request.onsuccess = function(){
                    deferred.resolve(data);
                };

                return deferred.promise;

            },

            update: function(objectStoreName, data, key) {

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
                var getRequest = store.get(key),
                    updateRequest;

                getRequest.onsuccess = function(e) {

                    var origData = e.target.result;

                    if (origData !== undefined){

                        data.insertDate = origData.insertDate;
                        data.modifiedDate = new Date();

                        updateRequest = store.put(data);

                        updateRequest.onsuccess = function(e){
                            deferred.resolve(data, e);
                        }
                    }

                }

                return deferred.promise;

            },

            getById: function(objectStoreName, key){

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName);
                var request = store.get(key);

                request.onsuccess = deferred.resolve;

                return deferred.promise;

            },

            'delete': function(objectStoreName, ){
                //Nothing to do yet
            },

            clear: function(objectStoreName) {

                var deferred = $q.defer();

                _db.requireObjectStoreName(objectStoreName, deferred);
                _db.requireOpenDB(objectStoreName, deferred);

                var store = _db.getObjectStore(objectStoreName, _db.transactionTypes.readwrite);
                var request = store.clear();

                request.onsuccess = deferred.resolve;

                return deferred.promise;

            }
        };

        return {
            open: _db.open,
            getAll: _db.getAll,
            insert: _db.insert,
            update: _db.update,
            getById: _db.getById,
            getCount: _db.getCount,
            'delete': _db.delete,
            clear: _db.clear
        };

    }

}(app));