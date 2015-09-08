"use strict";

require.config({
    baseUrl: './js',
    paths: {
        underscore: "../lib/underscore/underscore-min",
        jQuery: "../lib/jquery/jquery.min",
        mustache: "../lib/mustache/mustache.min"
    },
    shim: {
        jQuery: {export: '$'},
        underscore: {export: '_'}
    }
});

require(['jQuery', 'popup'], function ($, Popup) {
    Popup.onLoad();
});