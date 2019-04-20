var storageMethod = 'local',
    settings = {},
    Options = {};

var defaultSettings = {
    "COMMANDBARCSS": `
    #cVim-command-bar, #cVim-command-bar-mode, #cVim-command-bar-input, #cVim-command-bar-search-results,
    .cVim-completion-item, .cVim-completion-item .cVim-full, .cVim-completion-item .cVim-left,
    .cVim-completion-item .cVim-right {
        font-family: Helvetica, Helvetica Neue, Neue, sans-serif, monospace, Arial;
        font-size: 10pt !important;
        -webkit-font-smoothing: antialiased !important;
    }
    
    #cVim-command-bar {
        position: fixed;
        z-index: 2147483646;
        background-color: #1b1d1e;
        color: #bbb;
        display: none;
        box-sizing: content-box;
        box-shadow: 0 3px 3px rgba(0,0,0,0.4);
        left: 0;
        width: 100%;
        height: 20px;
    }
    
    #cVim-command-bar-mode {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        padding-left: 2px;
        height: 100%;
        width: 10px;
        padding-top: 2px;
        color: #888;
    }
    
    #cVim-command-bar-input {
        background-color: #1b1d1e;
        color: #bbb;
        height: 100%;
        right: 0;
        top: 0;
        width: calc(100% - 10px);
        position: absolute;
    }
    
    #cVim-command-bar-search-results {
        position: fixed;
        width: 100%;
        overflow: hidden;
        z-index: 2147483647;
        left: 0;
        box-shadow: 0 3px 3px rgba(0,0,0,0.4);
        background-color: #1c1c1c;
    }
    
    .cVim-completion-item, .cVim-completion-item .cVim-full, .cVim-completion-item .cVim-left, .cVim-completion-item .cVim-right {
        text-overflow: ellipsis;
        padding: 1px;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
    }
    
    .cVim-completion-item:nth-child(even) {
        background-color: #1f1f1f;
    }
    
    .cVim-completion-item {
        width: 100%; left: 0;
        color: #bcbcbc;
    }
    
    .cVim-completion-item[active] {
        width: 100%; left: 0;
        color: #1b1d1e;
        background-color: #f1f1f1;
    }
    
    .cVim-completion-item[active] span {
        color: #1b1d1e;
    }
    
    .cVim-completion-item .cVim-left {
        color: #fff;
        width: 37%;
    }
    
    .cVim-completion-item .cVim-right {
        font-style: italic;
        color: #888;
        width: 57%;
    }
    
    
    #cVim-link-container, .cVim-link-hint,
    #cVim-hud, #cVim-status-bar {
        font-family: Helvetica, Helvetica Neue, Neue, sans-serif, monospace, Arial;
        font-size: 10pt !important;
        -webkit-font-smoothing: antialiased !important;
    }
    
    #cVim-link-container {
        position: absolute;
        pointer-events: none;
        width: 100%; left: 0;
        height: 100%; top: 0;
        z-index: 2147483647;
    }
    
    .cVim-link-hint {
        position: absolute;
        color: #302505 !important;
        background-color: #ffd76e !important;
        border-radius: 2px !important;
        padding: 2px !important;
        font-size: 8pt !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        border: 1px solid #ad810c;
        display: inline-block !important;
        vertical-align: middle !important;
        text-align: center !important;
        box-shadow: 2px 2px 1px rgba(0,0,0,0.25) !important;
    }
    
    .cVim-link-hint_match {
        color: #777;
        text-transform: uppercase !important;
    }
    
    
    #cVim-hud {
        background-color: rgba(28,28,28,0.9);
        position: fixed !important;
        transition: right 0.2s ease-out;
        z-index: 24724289;
    }
    
    #cVim-hud span {
        padding: 2px;
        padding-left: 4px;
        padding-right: 4px;
        color: #8f8f8f;
        font-size: 10pt;
    }
    
    #cVim-frames-outline {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        z-index: 9999999999;
        box-sizing: border-box;
        border: 3px solid yellow;
    }
    .hl-selection {
        position: relative;
        display: inline-block;
        background: linear-gradient(-100deg, rgba(250, 226, 133, 0.3), rgba(250, 226, 133, 0.7) 95%, rgba(250, 226, 133, 0.1));
        border-radius: 1em 0px;
    }
    .hl-selection h1,
    .hl-selection h2,
    .hl-selection h3,
    .hl-selection h4 {
        margin: 0 !important;
    }
    `,
  "FUNCTIONS": {
    "NextPage": "(function(){ document.querySelector('[rel=\"next\"]').click() })",
    "PrevPage": "(function(){ document.querySelector('[rel=\"prev\"]').click() })",
        "SaveSelection": `(function(){ 
        var referenceNode = document.body;
        
        function unwrap(wrapper) {
            var docFrag = document.createDocumentFragment();
            while (wrapper.firstChild) {
                var child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }
            
            wrapper.parentNode.replaceChild(docFrag, wrapper);
        }
        
        function restore(state) {
            var i
            , node
            , nextNodeCharIndex
            , currentNodeCharIndex = 0
            , nodes = [referenceNode]
            , range = document.createRange();
            
            range.setStart(referenceNode, 0)
            range.collapse(true)
            
            while (node = nodes.pop()) {
                if (node.nodeType === 3) { // TEXT_NODE
                    nextNodeCharIndex = currentNodeCharIndex + node.length;
                    
                    if (state.start >= currentNodeCharIndex && state.start <= nextNodeCharIndex) {
                        range.setStart(node, state.start - currentNodeCharIndex);
                    }
                    if (state.end >= currentNodeCharIndex && state.end <= nextNodeCharIndex) {
                        range.setEnd(node, state.end - currentNodeCharIndex);
                        break;
                    }
                    
                    currentNodeCharIndex = nextNodeCharIndex;
                } else {
                    i = node.childNodes.length
                    while (i--) {
                        nodes.push(node.childNodes[i])
                    }
                }
            }
            
            
            var newNode = document.createElement('span');
            newNode.classList.add('hl-selection');
            
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
        }
        
        var sel = window.getSelection()
        , range = sel.rangeCount
        ? sel.getRangeAt(0).cloneRange()
        : document.createRange()
        , startContainer = range.startContainer
        , startOffset = range.startOffset
        , state = { content: range.toString() }
        
        
        range.selectNodeContents(referenceNode)
        range.setEnd(startContainer, startOffset)
        
        state.start = range.toString().length
        state.end = state.start + state.content.length
        
        var selections = document.querySelectorAll('.hl-selection'); [].map.call(selections, unwrap);
        
        const key = window.location.href.replace(window.location.hash, '');
        chrome.storage.sync.get([key], function(result) {
            var states = JSON.parse(result[key] || '{}');  
            console.log(states);
            if(state.content) {
                if(states[state.content]) {
                    delete states[state.content];
                } else {
                    states[state.content] = state;
                }
                chrome.storage.sync.set({[document.location.href]: JSON.stringify(states)}, function() {
                    console.log(states);
                });
                Object.values(states).forEach(restore);
            } else {
                if(!selections.length) Object.values(states).forEach(restore);
            }
        });
      })
      `
  },
  "GISTURL": "",
  "MAPPINGS": "map H scrollLeft\nmap L scrollRight\nmap h gT\nmap l gt\nmap d x\nmap u X\nmap ;f yankUrl\nmap <C-i> goForward\nmap <C-o> goBack\nunmap e\nmap * :call SaveSelection<CR>",
  "RC": "set noautofocus\nset numerichints\nset typelinkhints\n\"let barposition = \"bottom\"\nlet scrollstep = 170\nlet searchlimit = 10\nlet scrollduration = 500\nset smoothscroll\nmap H scrollLeft\nmap L scrollRight\nmap h gT\nmap l gt\nmap d x\nmap u X\nmap ;f yankUrl\nmap <C-i> goForward\nmap <C-o> goBack\n\"map t :tabnew<CR>\n\"map T :open<space>\nunmap e\n\nPrevPage -> {{ document.querySelector('[rel=\"prev\"]').click() }}\nNextPage -> {{ document.querySelector('[rel=\"next\"]').click() }}\n\nsite '*://*.rust-lang.org/*' {\n   map ]] :call NextPage<CR>\n   map [[ :call NextPage<CR>\n}\n\nSaveSelection -> {{\n  var referenceNode = document.body;\n\n  function unwrap(wrapper) {\n    var docFrag = document.createDocumentFragment();\n    while (wrapper.firstChild) {\n        var child = wrapper.removeChild(wrapper.firstChild);\n        docFrag.appendChild(child);\n    }\n\n    wrapper.parentNode.replaceChild(docFrag, wrapper);\n  }\n\n  function restore(state) {\n    var i\n        , node\n        , nextNodeCharIndex\n        , currentNodeCharIndex = 0\n        , nodes = [referenceNode]\n        , range = document.createRange();\n\n    range.setStart(referenceNode, 0)\n    range.collapse(true)\n\n    while (node = nodes.pop()) {\n        if (node.nodeType === 3) { // TEXT_NODE\n            nextNodeCharIndex = currentNodeCharIndex + node.length;\n\n            if (state.start >= currentNodeCharIndex && state.start <= nextNodeCharIndex) {\n                range.setStart(node, state.start - currentNodeCharIndex);\n            }\n            if (state.end >= currentNodeCharIndex && state.end <= nextNodeCharIndex) {\n                range.setEnd(node, state.end - currentNodeCharIndex);\n                break;\n            }\n\n            currentNodeCharIndex = nextNodeCharIndex;\n        } else {\n            i = node.childNodes.length\n            while (i--) {\n                nodes.push(node.childNodes[i])\n            }\n        }\n    }\n    \n\n    var newNode = document.createElement('span');\n    newNode.classList.add('hl-selection');\n    newNode.style.background = 'linear-gradient(-100deg, hsla(48,92%,75%,.3), hsla(48,92%,75%,.7) 95%, hsla(48,92%,75%,.1))';\n    newNode.style.borderRadius = '1em 0';\n\n    range.surroundContents(newNode); \n  }\n\n  var sel = window.getSelection()\n    , range = sel.rangeCount\n        ? sel.getRangeAt(0).cloneRange()\n        : document.createRange()\n    , startContainer = range.startContainer\n    , startOffset = range.startOffset\n    , state = { content: range.toString() }\n\n\n  range.selectNodeContents(referenceNode)\n  range.setEnd(startContainer, startOffset)\n\n  state.start = range.toString().length\n  state.end = state.start + state.content.length\n\n  var selections = document.querySelectorAll('.hl-selection'); [].map.call(selections, unwrap);\n\n  const key = window.location.href;\n  chrome.storage.sync.get([key], function(result) {\n    var states = JSON.parse(result[key] || '{}');  \n    console.log(states);\n    if(state.content) {\n        if(states[state.content]) {\n            delete states[state.content];\n        } else {\n            states[state.content] = state;\n        }\n        chrome.storage.sync.set({[document.location.href]: JSON.stringify(states)}, function() {\n            console.log(states);\n        });\n        Object.values(states).forEach(restore);\n    } else {\n        if(!selections.length) Object.values(states).forEach(restore);\n    }\n  });\n}}\n\nmap * :call SaveSelection<CR>",
  "autofocus": false,
  "autohidecursor": false,
  "autoupdategist": false,
  "barposition": "top",
  "blacklists": [],
  "changelog": true,
  "cncpcompletion": false,
  "completeonopen": false,
  "completionengines": [
    "google",
    "duckduckgo",
    "wikipedia",
    "amazon"
  ],
  "configpath": "",
  "debugcss": false,
  "defaultengine": "google",
  "defaultnewtabpage": false,
  "dimhintcharacters": true,
  "fullpagescrollpercent": 0,
  "hintcharacters": "asdfgqwertzxcvb",
  "homedirectory": "",
  "hud": true,
  "ignorecase": true,
  "incsearch": true,
  "insertmappings": true,
  "langmap": "",
  "linkanimations": false,
  "localconfig": false,
  "locale": "",
  "mapleader": "\\",
  "nativelinkorder": false,
  "nextmatchpattern": "((?!first)(next|older|more|>|›|»|forward| )+)",
  "numerichints": true,
  "previousmatchpattern": "((?!last)(prev(ious)?|newer|back|«|less|<|‹| )+)",
  "qmarks": {},
  "regexp": true,
  "scalehints": false,
  "scrollduration": 500,
  "scrollstep": 170,
  "searchaliases": {},
  "searchengines": {},
  "searchlimit": 10,
  "showtabindices": false,
  "sites": {
    "*://*.rust-lang.org/*": {
      "MAPPINGS": "map ]] :call NextPage<CR>\nmap [[ :call NextPage<CR>"
    }
  },
  "smartcase": true,
  "smoothscroll": true,
  "sortlinkhints": false,
  "timeoutlen": 1000,
  "typelinkhints": true,
  "typelinkhintsdelay": 300,
  "vimport": 8001,
  "zoomfactor": 0.1
};

chrome.storage.onChanged.addListener(function(changes) {
  if (!changes.hasOwnProperty('sessions')) {
    settings = changes.settings ? changes.settings.newValue : defaultSettings;
  }
});

Options.refreshSettings = function(callback) {
  for (var key in defaultSettings) {
    if (settings[key] === void 0) {
      settings[key] = defaultSettings[key];
    }
  }
  if (callback) {
    callback();
  }
};

Options.saveSettings = function(request) {
  settings = request.settings;
  for (var key in settings.qmarks) {
    Quickmarks[key] = settings.qmarks[key];
  }
  this.refreshSettings(function() {
    chrome.storage[storageMethod].set({settings: settings});
    if (request.sendSettings) {
      Options.sendSettings();
    }
  });
};

Options.sendSettings = function() {
  activePorts.forEach(function(port) {
    port.postMessage({
      type: 'sendSettings',
      settings: settings
    });
  });
};

Options.getSettings = function(request, sender) {
  this.refreshSettings(function() {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'sendSettings',
      settings: request.reset ? defaultSettings : settings
    });
  });
};

Options.setDefaults = function() {
  settings = defaultSettings;
  this.saveSettings(settings);
};

Options.getDefaults = function(request, sender, callback) {
  callback(defaultSettings);
};

// retrieve default and current settings
Options.getAllSettings = function(request, sender, callback) {
  callback({
    defaults: defaultSettings,
    current: settings
  });
};

Options.updateBlacklistsMappings = function() {
  var rc = Utils.compressArray(settings.RC.split(/\n+/)),
      i, index, line;
  if (settings.BLACKLISTS) {
    settings.blacklists = settings.BLACKLISTS.split(/\n+/);
    delete settings.BLACKLISTS;
  }
  for (i = 0; i < rc.length; ++i) {
    if (/ *let *blacklists *= */.test(rc[i])) {
      rc.splice(i, 1);
      index = i;
    }
  }
  settings.blacklists = Utils.uniqueElements(settings.blacklists);
  if (settings.blacklists.length) {
    line = 'let blacklists = ' + JSON.stringify(settings.blacklists);
    if (index) {
      rc = rc.slice(0, index).concat(line).concat(rc.slice(index));
    } else {
      rc.push(line);
    }
  }
  settings.RC = rc.join('\n');
  Options.saveSettings({settings: settings});
};

Options.fetchGist = function() {
  httpRequest({
    url: settings.GISTURL + (settings.GISTURL.indexOf('raw') === -1 &&
             settings.GISTURL.indexOf('github') !== -1 ? '/raw' : '')
  }).then(function(res) {
    var updated;
    try {
      updated = RCParser.parse(res);
    } catch (e) {
      console.error('cVim Error: error parsing config file');
    }
    updated.GISTURL = settings.GISTURL;
    updated.COMMANDBARCSS = settings.COMMANDBARCSS;
    Options.saveSettings({
      settings: updated,
      sendSettings: true
    });
    if (updated.autoupdategist) {
      window.setTimeout(Options.fetchGist, 1000 * 60 * 60);
    }
  });
};

chrome.storage[storageMethod].get('settings', function(data) {
  if (data.settings) {
    settings = data.settings;
    Quickmarks = settings.qmarks;
  }
  if (settings.debugcss)
    settings.COMMANDBARCSS = defaultSettings.COMMANDBARCSS;
  this.refreshSettings();
  this.updateBlacklistsMappings();
  if (settings.autoupdategist && settings.GISTURL) {
    this.fetchGist();
  }
}.bind(Options));

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (Options.hasOwnProperty(request.action)) {
    Options[request.action](request, sender, callback);
  }
});
