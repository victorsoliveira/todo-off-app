/**
 * Created by victor on 09/07/15.
 */

(function(app){

    'use strict';

    app.service('syncService',
        ['Offline', 'localDBService', 'dbModel', '$q', 'remotePersistenceStrategy', syncService]);


    function syncService(Offline, localDBService, dbModel, $q, remotePersistenceStrategy){

    }

}(app));