/**
 * Created by victor on 08/07/15.
 */

window.indexedDB = window.indexedDB ||
                    window.mozIndexedDB ||
                    window.webkitIndexedDB ||
                    window.msIndexedDB;


window.IDBTransaction = window.IDBTransaction ||
                        window.webkitIDBTransaction ||
                        window.msIDBTansaction;


window.IDBKeyRange = window.IDBKeyRange ||
                    window.webkitIDBKeyRange ||
                    window.msIDBKeyRange;


var app = angular.module('todoApp', ['ngResource']);

app.config(['$provide', function($provide) {

    $provide.constant('indexedDB', window.indexedDB);
    $provide.constant('_', window._);
    $provide.constant('localStorage', window.localStorage);
    $provide.constant('Offline', window.Offline);
    $provide.constant('uuid', window.uuid);

    $provide.value('nullTodo', {
        id: '',
        insertDate: new Date(-8640000000000000),
        modifiedDate: new Date(-8640000000000000)
    });

    $provide.value('dbModel', {
        name: 'todoApp',
        version: 1,
        instance: null,
        objectStoreName: 'todos',
        keyName: 'id',
        upgrade: function(e) {

            var db = e.target.result;

            if(!db.objectStoreNames.contains('todos')) {
                db.createObjectStore('todos', { keyPath: 'id'} );
            }
        }

    });

}]);