// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

    // html template for panel
    template: `
    <h2>UITools</h2>
    <hr />
    <div>State: <span id="label">--</span></div>
    <hr />
    <!--ui-button id="btn">Send To Main</ui-button-->
    <ui-button id="btnShowSelectInfo">ShowSelectInfo</ui-button>
    <ui-button id="btnShowSelectInfoNoSame">ShowSelectInfo（去重）</ui-button>
    <ui-button id="btnCreatePanelScript">CreatePanelScript</ui-button>
    <ui-button id="btnCreateItemScript">CreateItemScript</ui-button>
  `,

    // element and variable binding
    $: {
        // btnSendToMain: '#btn',
        btnShowSelectInfo: "#btnShowSelectInfo",
        btnShowSelectInfoNoSame: "#btnShowSelectInfoNoSame",
        btnCreatePanelScript: "#btnCreatePanelScript",
        btnCreateItemScript: "#btnCreateItemScript",
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        // this.$btnSendToMain.addEventListener('confirm', () => {
        //   Editor.Ipc.sendToMain('ui_tools:clicked');
        // });

        this.$btnShowSelectInfo.addEventListener("confirm", () => {
            // Editor.Ipc.sendToMain('ui_tools:clickedTest');
            // Editor.Scene.callSceneScript('ui_tools', 'get_canvas_children', function (err, length) {
            //   console.log(`get_canvas_children callback : length - ${length}`);
            // });
            Editor.Scene.callSceneScript("ui_tools", "showSelectInfo")
        })

        this.$btnShowSelectInfoNoSame.addEventListener("confirm", () => {
            // Editor.Ipc.sendToMain('ui_tools:clickedTest');
            // Editor.Scene.callSceneScript('ui_tools', 'get_canvas_children', function (err, length) {
            //   console.log(`get_canvas_children callback : length - ${length}`);
            // });
            Editor.Scene.callSceneScript("ui_tools", "showSelectInfoNoSame")
        })

        this.$btnCreatePanelScript.addEventListener("confirm", () => {
            Editor.Scene.callSceneScript("ui_tools", "btnCreatePanelScript")
        })

        this.$btnCreateItemScript.addEventListener("confirm", () => {
            Editor.Scene.callSceneScript("ui_tools", "btnCreateItemScript")
        })
        // this.$btnGetPanelInfo.addEventListener('confirm', () => {
        //   Editor.log('OnClick getPanelInfo');
        //   Editor.Scene.callSceneScript('ui_tools', 'getPanelInfo', function (err, info) {
        //     if (err) {
        //       Editor.log(`getPanelInfo callback : ${err}`);
        //     }
        //     else {
        //       Editor.log(`getPanelInfo callback : ${info}`);
        //     }
        //   });

        // });

        // this.$btnShowAssetsSelectInfo.addEventListener('confirm', () => {
        //   Editor.Ipc.sendToMain('ui_tools:showAssetsSelectInfo');
        // });
    },

    // 面板渲染进程消息监听
    // register your ipc messages here
    messages: {
        "ui_tools:hello"(event) {
            this.$label.innerText = "Hello!"
        },
        "ui_tools:clickedTest"(event) {
            this.$label.innerText = "ClickedTest!"
        },
    },
})
