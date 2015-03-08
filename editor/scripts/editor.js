"use strict";

var app = {
    edit: function (){

        // bind editor event
        $('a, p').click(function (e){
            e.stopPropagation();
            app.showPanel($(this));

            // enable link work
            return false;
        });
    },
    showPanel:function (editElem){
        app.resetPanel();

        var editTypeGroup = ['textlink', 'imglink', 'para'];
        var editElemType = editElem.attr('data-edittype');

        if (editElemType) { show(editElem);}

        function show(editElem) {
            var titleElem = $('.editPanelWrap .panel-heading span'),
                inputElem = $('.editPanelWrap input'),
                textElem = $('.editPanelWrap textarea');

            // clean edit-ok button event bind
            $('.editPanelWrap .edit-ok').unbind('click');

            switch (editElemType)
            {
                case editTypeGroup[0]:
                    // edit href and link text
                    titleElem.text('Edit link');
                    inputElem.val(editElem.prop('href'))
                        .show();
                    textElem.val(editElem.text())
                        .show();

                    // update editing data
                    $('.editPanelWrap .edit-ok').bind('click', rewriteTextLink);
                    break;
                case editTypeGroup[1]:
                    // edit href
                    titleElem.text('Edit link');
                    textElem.hide();
                    inputElem.val(editElem.prop('href'))
                        .show();

                    // update editing data
                    $('.editPanelWrap .edit-ok').bind('click', rewriteImgLink);
                    break;
                case editTypeGroup[2]:
                    // edit paragragh
                    titleElem.text('Edit Paragragh');
                    inputElem.hide();
                    textElem.val(editElem.text())
                        .show();

                    // update editing data
                    $('.editPanelWrap .edit-ok').bind('click', rewritePara);
                    break;
            }

            function rewriteTextLink (){
                editElem.attr('href', $('.editPanelWrap input').val());
                editElem.text($('.editPanelWrap textarea').val());
                app.closePanel();
            }

            function rewriteImgLink (){
                editElem.attr('href', $('.editPanelWrap input').val());
                app.closePanel();
            }

            function rewritePara (){
                editElem.text($('.editPanelWrap textarea').val());
                app.closePanel();
            }

            $('.editPanelWrap').show();
        }
    },
    closePanel: function (){
        $('.editPanelWrap').hide();
    },
    resetPanel: function (){
         $('.editPanelWrap *').val('');
    },
    createEmail: function (){
        var fullHtmlStr = '<html><head lang="en"><meta charset="UTF-8"><title></title></head><body>' + document.getElementsByTagName('body')[0].innerHTML + '</body></html>';
        // remove data-edittype attribute
        fullHtmlStr = fullHtmlStr.replace(/ data-edittype="textlink"/g, '')
            .replace(/ data-edittype="imglink"/g, '')
            .replace(/ data-edittype="para"/g, '');

        // remove editPanel dom
        removeEditorDom('<!--emailStar-->', '<!--emailStar end-->');

        // remove topbar dom
        removeEditorDom('<!--topbar-->', '<!--topbar end-->');

        // removeDom
        // Input: starComment:String, endComment:String
        // Output: fullHtmlStr subStringed
        function removeEditorDom(starComment, endComment){
            var subStrStart = fullHtmlStr.indexOf(starComment);
            var subStrEnd = fullHtmlStr.indexOf(endComment) + endComment.length+1;
            // get editPanel dom content
            var editPanelStr = fullHtmlStr.substring(subStrStart, subStrEnd);
            // remove panel content
            fullHtmlStr = fullHtmlStr.replace(editPanelStr, '');
        }

        // show full html in editPanel
        var fullHtmlDom = $('<p data-edittype="para"></p>').text(fullHtmlStr);
        app.showPanel(fullHtmlDom);
        $('.editPanel .panel-heading span').text('Please copy the whole email html code below.');
        $('.editPanel .edit-content').focus().select();
    },
    init: function (){
        var headerBar = '<!--topbar--><div class="wf-editor-header"><div class="btn btn-normal resetEmail">Reset</div>&nbsp;&nbsp;<div class="btn btn-success createEmail">Create</div><div class="cb"></div></div><!--topbar end-->';

        // inject headerbar to email header
        $('body').find('table:first').prepend(headerBar);

        // init edit
        app.edit();

        // bind create
        $('.createEmail').click(function (){
            app.createEmail();
        });

        // bind close method
        $('.edit-cancel, .edit-close').click(function (){
            app.closePanel();
        });

        $('html').keydown(function (e){
            // press esc
            if (e.keyCode == 27 ) { app.closePanel(); }
        });
    }
};

$(function (){
    app.init();
});