import React from 'react';
import axios from 'axios'


var Common = {
    get(api, data, onSuccess, onError) {
        axios.get(api, {
            params: data
        }).then(function (response) {
            if (onSuccess)
                onSuccess(response.data);
        }).catch(function (error) {
            if (onError)
                onError(error);
        });
    },

    post(api, data, onSuccess, onError) {
        axios.post(api, data)
            .then(function (response) {
                if (onSuccess)
                    onSuccess(response.data);
            }).catch(function (error) {
                if (onError)
                    onError(error);
            });
    },

}
module.exports = Common;