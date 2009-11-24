/*

  Note that this file is just an example.  It should not be treated as
  part of Ymacs itself.  Ymacs is just an editing platform and as such
  it has no menus, no toolbar etc.  These can be easily added using
  other DynarchLIB widgets, as this file demonstrates.

  If a collection of useful menus/toolbars will emerge, a new compound
  widget will be defined.

*/

var desktop = new DlDesktop({});
desktop.fullScreen();

function print(obj) {
        var a = [], i;
        for (i in obj) {
                var val = obj[i];
                if (val instanceof Function)
                        val = val.toString();
                else
                        val = DlJSON.encode(val);
                a.push(DlJSON.encode(i) + " : " + val);
        }
        return a.map(function(line){
                return line.replace(/^/mg, function(s) {
                        return "        ";
                });
        }).join("\n");
};

var info = ( "Existing keybindings:\n\n" +
             print(Ymacs_Keymap_Emacs.KEYS)
             + "\n\nHave fun!\n" );

var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis posuere dui, id facilisis metus blandit nec. Ut pulvinar felis vitae lacus mattis fermentum semper risus aliquet. Sed nec dolor quis odio condimentum pellentesque. Donec non vehicula massa. Nulla a rutrum nulla. Morbi dapibus pharetra ligula, ac pharetra purus scelerisque sit amet. Nulla non velit ut urna gravida rutrum non vitae leo. Duis gravida, lacus eget laoreet semper, magna sem scelerisque dolor, a sagittis lacus justo nec lectus. Vivamus lacus massa, mattis ut rutrum ac, consectetur vel ipsum. Suspendisse potenti. Fusce convallis lorem vel dui tristique non viverra mi feugiat. Vivamus mollis rutrum porta. Nunc non purus ut sapien pretium tristique aliquam sit amet eros. Vivamus vel rutrum lacus.\n\
\n\
Nullam vitae tellus enim, id suscipit nisl. Mauris elementum scelerisque lacus ac pellentesque. Donec rutrum tellus vel leo lacinia semper. Nulla porta, elit non vulputate pulvinar, eros lacus euismod libero, ut laoreet erat lacus a est. Nam quis mi nec nisl aliquam tempor eget vel massa. Sed justo ante, ornare ut tristique a, laoreet ac justo. Proin gravida cursus mauris a porttitor. Aliquam elit justo, euismod suscipit pharetra ut, placerat et dolor. Donec pulvinar elit nec ligula gravida scelerisque. Aenean rutrum tempus dui at volutpat. Maecenas a justo quis libero vehicula fermentum sit amet in augue. In ante nulla, fermentum at rutrum id, tincidunt ut massa. Vivamus quis justo ut quam tempor ultricies ultricies vitae tellus. Pellentesque lorem elit, convallis ut congue at, porta non nisi. Curabitur lectus tortor, elementum venenatis faucibus ut, vulputate vehicula dui. Fusce in dui id est lobortis venenatis eu ut dolor. Quisque vel diam diam. Nulla porttitor adipiscing nisi eget cursus. .\n\n".x(10);

try {
        var dlg = new DlDialog({ title: "Ymacs", resizable: true });
        var javascript = new Ymacs_Buffer({ name: "test.js" });

        javascript.setCode("\
/* Note that there are a few buffers already loaded.\n\
   You can switch through them using C-TAB or C-S-TAB.\n\
   You can also split frames using C-x 2 or C-x 3, or\n\
   revert to a single frame (the active one) with C-x 1.\n\
 */\n\
\n\
function () {\n\
        alert(\"moo\");\n\
        while (foo) {\n\
        }\n\
\n\
/**\n\
* press TAB on these lines to fix indentation,\n\
* or move the caret to the first “{” character and press C-M-q\n\
*/\n\
        return function(){\n\
    alert(this.foo);\n\
}.$(this);\n\
}\n\
");

        var xml = new Ymacs_Buffer({ name: "index.html" });
        xml.setCode("\
<html>\n\
  <head>\n\
    <title>Ymacs -- Open Source Source Code Editor. :-p</title>\n\
  </head>\n\
  <body style=\"margin: 1em auto; width: 80%\"\n\
        id=\"foo\">\n\
    <h1 class=\"PageTitle\">Cool, isn't it?</h1>\n\
  </body>\n\
</html>\
");

        var txt = new Ymacs_Buffer({ name: "lorem.txt" });
        txt.setCode(lorem);

        javascript.cmd("javascript_dl_mode");
        javascript.setq("indent_level", 4);
        xml.cmd("xml_mode");

        var lisp = new Ymacs_Buffer({ name: "test.lisp" });
        lisp.setCode(";; Some basic Common-Lisp highlighting and indentation\n\
;; Parens are auto-inserted\n\
;; And you can close all remaining parens with C-c ] or C-c C-]\n\
\n\
(defun foo ())\n");
        lisp.cmd("lisp_mode");

        var markdown = new Ymacs_Buffer({ name: "markdown.txt" });
        markdown.cmd("markdown_mode");

        var keys = new Ymacs_Buffer({ name: "keybindings.txt" });
        keys.setCode(info);

        var layout = new DlLayout({ parent: dlg });

        var ymacs = window.ymacs = new Ymacs({ buffers: [ markdown, javascript, xml, lisp, txt, keys ], className: "Ymacs-Theme-dark" });

        var menu = new DlHMenu({});
        menu.setStyle({ marginLeft: 0, marginRight: 0 });

        var item = new DlMenuItem({ parent: menu, label: "Load it's own code!".makeLabel() });

        var files = [
                "ymacs-buffer.js",
                "ymacs-commands.js",
                "ymacs-frame.js",
                "ymacs.js",
                "ymacs-keymap-emacs.js",
                "ymacs-keymap-isearch.js",
                "ymacs-keymap.js",
                "ymacs-marker.js",
                "ymacs-mode-js.js",
                "ymacs-mode-xml.js",
                "ymacs-mode-lisp.js",
                "ymacs-mode-markdown.js",
                "ymacs-regexp.js",
                "ymacs-textprop.js",
                "ymacs-tokenizer.js"
        ];
        var submenu = new DlVMenu({});
        item.setMenu(submenu);
        files.foreach(function(file){
                var item = new DlMenuItem({ label: file, parent: submenu });
                item.addEventListener("onSelect", function(){
                        var request = new DlRPC({ url: YMACS_SRC_PATH + file + "?killCache=" + new Date().getTime() });
                        request.call({
                                callback: function(data){
                                        var code = data.text;
                                        var buf = ymacs.getBuffer(file) || ymacs.createBuffer({ name: file });
                                        buf.setCode(code);
                                        buf.cmd("javascript_dl_mode", true);
                                        ymacs.switchToBuffer(buf);
                                }
                        });
                });
        });

        var item = new DlMenuItem({ parent: menu, label: "Set indentation level".makeLabel() });
        item.addEventListener("onSelect", function() {
                var buf = ymacs.getActiveBuffer(), newIndent;
                newIndent = prompt("Indentation level for the current buffer: ", buf.getq("indent_level"));
                if (newIndent != null)
                        newIndent = parseInt(newIndent, 10);
                if (newIndent != null && !isNaN(newIndent)) {
                        buf.setq("indent_level", newIndent);
                        buf.signalInfo("Done setting indentation level to " + newIndent);
                }
        });

        menu.addFiller();

        /* -----[ color theme ]----- */

        var item = new DlMenuItem({ parent: menu, label: "Color theme".makeLabel() });
        var submenu = new DlVMenu({});
        item.setMenu(submenu);

        [
                "dark|Dark background",
                "light|Light background"

        ].foreach(function(theme){
                theme = theme.split(/\|/);
                var item = new DlMenuItem({ parent: submenu, label: theme[1] });
                item.addEventListener("onSelect", ymacs.setColorTheme.$(ymacs, theme[0]));
        });

        /* -----[ font ]----- */

        var item = new DlMenuItem({ parent: menu, label: "Font family".makeLabel() });
        var submenu = new DlVMenu({});
        item.setMenu(submenu);

        item = new DlMenuItem({ parent: submenu, label: "Default from ymacs.css" });
        item.addEventListener("onSelect", function(){
                ymacs.getActiveFrame().setStyle({ fontFamily: "" });
        });

        submenu.addSeparator();

        [
                "Lucida Sans Typewriter",
                "Andale Mono",
                "Courier New",
                "Arial",
                "Verdana",
                "Tahoma",
                "Georgia",
                "Times New Roman"

        ].foreach(function(font){
                item = new DlMenuItem({ parent: submenu, label: "<span style='font-family:" + font + "'>" + font + "</span>" });
                item.addEventListener("onSelect", function(){
                        ymacs.getActiveFrame().setStyle({ fontFamily: font });
                });
        });

        // ymacs.getActiveFrame().setStyle({ fontFamily: "Arial", fontSize: "18px" });

        /* -----[ font size ]----- */

        var item = new DlMenuItem({ parent: menu, label: "Font size".makeLabel() });
        var submenu = new DlVMenu({});
        item.setMenu(submenu);

        item = new DlMenuItem({ parent: submenu, label: "Default from ymacs.css" });
        item.addEventListener("onSelect", function(){
                ymacs.getActiveFrame().setStyle({ fontSize: "" });
        });

        submenu.addSeparator();

        [
                "11px",
                "12px",
                "14px",
                "16px",
                "18px",
                "20px",
                "22px",
                "24px"

        ].foreach(function(font){
                item = new DlMenuItem({ parent: submenu, label: "<span style='font-size:" + font + "'>" + font + "</span>" });
                item.addEventListener("onSelect", function(){
                        ymacs.getActiveFrame().setStyle({ fontSize: font });
                });
        });

        layout.packWidget(menu, { pos: "top" });
        layout.packWidget(ymacs, { pos: "bottom", fill: "*" });

        dlg._focusedWidget = ymacs;
        dlg.setSize({ x: 800, y: 600 });

        // show two frames initially
        // ymacs.getActiveFrame().hsplit();

        dlg.show(true);
        dlg.maximize(true);

} catch(ex) {
        console.log(ex);
}

DynarchDomUtils.trash($("x-loading"));
