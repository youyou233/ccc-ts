'use strict';

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('ui_tools');
    },
    // 'say-hello' () {
    //   Editor.log('Hello World!');
    //   // send ipc message to panel
    //   Editor.Ipc.sendToPanel('UITools', 'UITools:hello');
    // },
    'clicked'() {
      Editor.log('Button clicked!');
    },

    'clickedTest'() {
      Editor.log('Button Test clicked!');
      Editor.Ipc.sendToPanel('ui_tools', 'UITools:clickedTest');
    },
    
    'showAssetsSelectInfo'() {
      Editor.log('ShowAssetsSelectInfo clicked!');
    }
    // changeTextureID
    // let orUUID = Editor.assetdb.fspathToUuid(path)
    // let uuid = Editor.Utils.UuidUtils.compressUuid(orUUID, false)
    // saveMap[uuid] = Editor.assetdb.uuidToUrl(orUUID)
  },
};