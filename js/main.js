"use strict";

require.config({
    baseUrl: './js',
    paths: {
        underscore: "../lib/underscore/underscore-min",
        jQuery: "../lib/jquery/jquery.min",
        mustache: "../lib/mustache/mustache.min",
        materialize: "../lib/materialize/js/materialize.min"
    },
    shim: {
        jQuery: {exports: '$'},
        underscore: {exports: '_'},
        materialize: {exports: 'Materialize'}
    }
});

require(['jQuery', 'popup'], function ($, Popup) {
    require(['materialize']);
    Popup.onLoad();
});