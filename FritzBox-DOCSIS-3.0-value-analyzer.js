// ==UserScript==
// @name         Fritz!Box DOCSIS 3.0 value analyzer
// @namespace    https://github.com/saminitz/Tampermonkey-scripts
// @version      1.2
// @description  This script allows you to visually display the current status of the DOCSIS values.
// @author       QuerSlider
// @match        http://192.168.1.1/*
// @match        http://192.168.178.1/*
// @match        http://fritz.box/*
// @icon         https://upload.wikimedia.org/wikipedia/de/6/68/Fritz%21_Logo.svg
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/saminitz/Tampermonkey-scripts/master/FritzBox-DOCSIS-3.0-value-analyzer.js
// @updateURL    https://raw.githubusercontent.com/saminitz/Tampermonkey-scripts/master/FritzBox-DOCSIS-3.0-value-analyzer.js
// ==/UserScript==

window.onload = function() {
    var target = document.getElementById('content');

    if (target == undefined) {
        return;
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.querySelector('#content > h2.direction') != undefined) {
                updateColor();
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(target, config);
};


function updateColor() {
    var downRows = document.querySelectorAll('#uiDocsis30Ds .flexRow:not(.titleRow)');
    var upRows = document.querySelectorAll('#uiDocsis30Us .flexRow:not(.titleRow)');

    for (var i = 0; i < downRows.length; i++) {
        getSingleItems(downRows[i], 'down');
    }
    for (var i = 0; i < upRows.length; i++) {
        getSingleItems(upRows[i], 'up');
    }
}

function getSingleItems(row, direction) {
    var type = row.querySelector('[prefid="type"]').textContent;

    var powerLevelCell = row.querySelector('[prefid="powerLevel"]');
    var powerLevel = parseFloat(powerLevelCell.textContent);
    checkAndColorValue(powerLevelCell, powerLevel, direction + type, 'powerLevel');

    var mseCell = row.querySelector('[prefid="mse"]');
    if (mseCell == undefined) {
        return;
    }
    var mseLevel = parseFloat(mseCell.textContent);
    checkAndColorValue(mseCell, mseLevel, direction + type, 'mse');
}

function checkAndColorValue(element, value, type, category) {
    var referenceValues = {'down256QAM': { 'powerLevel': [-8.0, -6.0, -4.0, 13.0, 18.0, 20.0], 'mse': [-30, -32, -33] },
                           'down64QAM': { 'powerLevel': [-14.0, -12.0, -10.0, 7.0, 12.0, 14.0], 'mse': [-24, -26, -27] },
                           'up64QAM': { 'powerLevel': [35, 37, 41, 47, 51, 53] },
                           'up16QAM': { 'powerLevel': [35, 37, 41, 47, 51, 53] }};

    switch (category) {
        case 'powerLevel':
            if (value <= referenceValues[type][category][0]) {
                element.style.backgroundColor = 'rgb(255 0 0 / 40%)';
            }
            else if (value <= referenceValues[type][category][1]) {
                element.style.backgroundColor = 'rgb(255 255 0 / 40%)';
            }
            else if (value <= referenceValues[type][category][2]) {
                element.style.backgroundColor = 'rgba(0 128 0 / 40%';
            }
            else if (value <= referenceValues[type][category][3]) {
                element.style.backgroundColor = 'rgba(0 128 0 / 60%';
            }
            else if (value <= referenceValues[type][category][4]) {
                element.style.backgroundColor = 'rgba(0 128 0 / 40%';
            }
            else if (value <= referenceValues[type][category][5]) {
                element.style.backgroundColor = 'rgb(255 255 0 / 40%)';
            }
            else if (value > referenceValues[type][category][5]) {
                element.style.backgroundColor = 'rgb(255 0 0 / 40%)';
            }
            break;

        case 'mse':
            if (value > referenceValues[type][category][0]) {
                element.style.backgroundColor = 'rgb(255 0 0 / 40%)';
            }
            else if (value > referenceValues[type][category][1]) {
                element.style.backgroundColor = 'rgb(255 255 0 / 40%)';
            }
            else if (value > referenceValues[type][category][2]) {
                element.style.backgroundColor = 'rgba(0 128 0 / 40%';
            }
            else if (value <= referenceValues[type][category][2]) {
                element.style.backgroundColor = 'rgba(0 128 0 / 60%';
            }
            break;
    }
}
