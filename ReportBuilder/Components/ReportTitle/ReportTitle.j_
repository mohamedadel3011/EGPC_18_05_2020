define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/text!./ReportTitle.html",
], function (_WidgetBase,
    _OnDijitClickMixin,
    _TemplatedMixin,
    Evented,
    declare,
    dijitTemplate) {
    return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
        declaredClass: "ReportTitle.ReportTitleModule",
        templateString: dijitTemplate,
        options: {map: null},
        nls:null,
        constructor: function (options) {
            declare.safeMixin(this.options, options);
            this.nls = options.reportBuilderWidget.nls;
            this.set("map", this.options.map);
        },

        startup: function () {
            //Rich Text Editor
            $('.rich_txt').richText({
                // text formatting
                bold: true,
                italic: true,
                underline: true,

                // text alignment
                leftAlign: true,
                centerAlign: true,
                rightAlign: true,

                // lists
                ol: false,
                ul: false,

                // title
                heading: false,

                // fonts
                fonts: true,
                fontList: ["Arial",
                    "Arial Black",
                    "Comic Sans MS",
                    "Courier New",
                    "Geneva",
                    "Georgia",
                    "Helvetica",
                    "Impact",
                    "Lucida Console",
                    "Tahoma",
                    "Times New Roman",
                    "Verdana"
                ],
                fontColor: true,
                fontSize: true,

                // uploads
                imageUpload: false,
                fileUpload: false,

                // media
                //<a href="https://www.jqueryscript.net/tags.php?/video/">video</a>
                Embed: false,

                // link
                urls: false,

                // tables
                table: false,

                // code
                removeStyles: false,
                code: false,

                // colors
                colors: [],

                // dropdowns
                fileHTML: '',
                imageHTML: '',

                // translations
                translations: {
                    'title': 'Title',
                    'white': 'White',
                    'black': 'Black',
                    'brown': 'Brown',
                    'beige': 'Beige',
                    'darkBlue': 'Dark Blue',
                    'blue': 'Blue',
                    'lightBlue': 'Light Blue',
                    'darkRed': 'Dark Red',
                    'red': 'Red',
                    'darkGreen': 'Dark Green',
                    'green': 'Green',
                    'purple': 'Purple',
                    'darkTurquois': 'Dark Turquois',
                    'turquois': 'Turquois',
                    'darkOrange': 'Dark Orange',
                    'orange': 'Orange',
                    'yellow': 'Yellow',
                    'imageURL': 'Image URL',
                    'fileURL': 'File URL',
                    'linkText': 'Link text',
                    'url': 'URL',
                    'size': 'Size',
                    'responsive': '<a href="https://www.jqueryscript.net/tags.php?/Responsive/">Responsive</a>',
                    'text': 'Text',
                    'openIn': 'Open in',
                    'sameTab': 'Same tab',
                    'newTab': 'New tab',
                    'align': 'Align',
                    'left': 'Left',
                    'center': 'Center',
                    'right': 'Right',
                    'rows': 'Rows',
                    'columns': 'Columns',
                    'add': 'Add',
                    'pleaseEnterURL': 'Please enter an URL',
                    'videoURLnotSupported': 'Video URL not supported',
                    'pleaseSelectImage': 'Please select an image',
                    'pleaseSelectFile': 'Please select a file',
                    'bold': 'Bold',
                    'italic': 'Italic',
                    'underline': 'Underline',
                    'alignLeft': 'Align left',
                    'alignCenter': 'Align centered',
                    'alignRight': 'Align right',
                    'addOrderedList': 'Add ordered list',
                    'addUnorderedList': 'Add unordered list',
                    'addHeading': 'Add Heading/title',
                    'addFont': 'Add font',
                    'addFontColor': 'Add font color',
                    'addFontSize': 'Add font size',
                    'addImage': 'Add image',
                    'addVideo': 'Add video',
                    'addFile': 'Add file',
                    'addURL': 'Add URL',
                    'addTable': 'Add table',
                    'removeStyles': 'Remove styles',
                    'code': 'Show HTML code',
                    'undo': 'Undo',
                    'redo': 'Redo',
                    'close': 'Close'
                },

                // dev settings
                useSingleQuotes: false,
                height: 0,
                heightPercentage: 0,
                id: "",
                class: "",
                useParagraph: false
            });
            $('.rich_txt2').richText({
                // text formatting
                bold: true,
                italic: true,
                underline: true,

                // text alignment
                leftAlign: true,
                centerAlign: true,
                rightAlign: true,

                // lists
                ol: false,
                ul: false,

                // title
                heading: false,

                // fonts
                fonts: true,
                fontList: ["Arial",
                    "Arial Black",
                    "Comic Sans MS",
                    "Courier New",
                    "Geneva",
                    "Georgia",
                    "Helvetica",
                    "Impact",
                    "Lucida Console",
                    "Tahoma",
                    "Times New Roman",
                    "Verdana"
                ],
                fontColor: true,
                fontSize: true,

                // uploads
                imageUpload: false,
                fileUpload: false,

                // media
                '<a href="https://www.jqueryscript.net/tags.php?/video/">video</a>Embed': false,

                // link
                urls: false,

                // tables
                table: false,

                // code
                removeStyles: false,
                code: false,

                // colors
                colors: [],

                // dropdowns
                fileHTML: '',
                imageHTML: '',

                // translations
                translations: {
                    'title': 'Title',
                    'white': 'White',
                    'black': 'Black',
                    'brown': 'Brown',
                    'beige': 'Beige',
                    'darkBlue': 'Dark Blue',
                    'blue': 'Blue',
                    'lightBlue': 'Light Blue',
                    'darkRed': 'Dark Red',
                    'red': 'Red',
                    'darkGreen': 'Dark Green',
                    'green': 'Green',
                    'purple': 'Purple',
                    'darkTurquois': 'Dark Turquois',
                    'turquois': 'Turquois',
                    'darkOrange': 'Dark Orange',
                    'orange': 'Orange',
                    'yellow': 'Yellow',
                    'imageURL': 'Image URL',
                    'fileURL': 'File URL',
                    'linkText': 'Link text',
                    'url': 'URL',
                    'size': 'Size',
                    'responsive': '<a href="https://www.jqueryscript.net/tags.php?/Responsive/">Responsive</a>',
                    'text': 'Text',
                    'openIn': 'Open in',
                    'sameTab': 'Same tab',
                    'newTab': 'New tab',
                    'align': 'Align',
                    'left': 'Left',
                    'center': 'Center',
                    'right': 'Right',
                    'rows': 'Rows',
                    'columns': 'Columns',
                    'add': 'Add',
                    'pleaseEnterURL': 'Please enter an URL',
                    'videoURLnotSupported': 'Video URL not supported',
                    'pleaseSelectImage': 'Please select an image',
                    'pleaseSelectFile': 'Please select a file',
                    'bold': 'Bold',
                    'italic': 'Italic',
                    'underline': 'Underline',
                    'alignLeft': 'Align left',
                    'alignCenter': 'Align centered',
                    'alignRight': 'Align right',
                    'addOrderedList': 'Add ordered list',
                    'addUnorderedList': 'Add unordered list',
                    'addHeading': 'Add Heading/title',
                    'addFont': 'Add font',
                    'addFontColor': 'Add font color',
                    'addFontSize': 'Add font size',
                    'addImage': 'Add image',
                    'addVideo': 'Add video',
                    'addFile': 'Add file',
                    'addURL': 'Add URL',
                    'addTable': 'Add table',
                    'removeStyles': 'Remove styles',
                    'code': 'Show HTML code',
                    'undo': 'Undo',
                    'redo': 'Redo',
                    'close': 'Close'
                },

                // dev settings
                useSingleQuotes: false,
                height: 0,
                heightPercentage: 0,
                id: "",
                class: "",
                useParagraph: false
            });

            //On Focus
            $(".richText-editor").focus(function () {
                $('.richText-margin').removeClass('richText-margin');
                $(this).parent('.richText').addClass('richText-margin');
                $(this).parent('.richText').next('label').fadeOut();
                $(".richText-toolbar").hide();
                $(this).prev(".richText-toolbar").show();
            });

            //On Focus Out
            $(".richText-editor").focusout(function () {
                var div_content = $(this).text();
                if (div_content === '') {
                    $(this).parent('.richText').next('label').fadeIn();
                }
            });

            //On Label Focus
            $('.titleDescription label').click(function () {
                $(this).fadeOut();
                $(this).parent().find('.richText-editor').trigger("focus");
            });

            //Close 
            $(".richText .richText-toolbar").click(function (e) {
                if (e.offsetX > $(".richText .richText-toolbar").width()) {
                    $(".richText-dropdown-close span").trigger("click");
                    $(this).hide();
                    $('.richText-margin').removeClass('richText-margin');
                }
            });

            // todo handel focus out rich text
            $(".richText-btn").click(function () {
                //$(this).closest(".richText-toolbar").show();
            });

            var event = document.getElementsByClassName("richText-editor");
            event[0].addEventListener('keydown', function (event) {
                const key = event.key; // const {key} = event; ES6+
                if (key === "Backspace" || key === "Delete") {
                    // do nothing
                } else {
                    var text = $(this).text();
                    if (text.length > 31) {
                        event.preventDefault();
                    }
                }
            });
            event[1].addEventListener('keydown', function (event) {
                const key = event.key; // const {key} = event; ES6+
                if (key === "Backspace" || key === "Delete") {
                    // do nothing
                } else {
                    var text = $(this).text();
                    if (text.length > 60) {
                        event.preventDefault();
                    }
                }
            });
        },

        destroy: function () {
            this.inherited(arguments);
        }
    });
});