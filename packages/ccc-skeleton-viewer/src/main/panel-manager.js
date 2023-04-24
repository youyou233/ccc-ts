const { BrowserWindow } = require('electron');
const { join } = require('path');
const PackageUtil = require('../eazax/package-util');
const { language, translate } = require('../eazax/editor-main-util');
const { calcWindowPosition } = require('../eazax/window-util');

/** 包名 */
const PACKAGE_NAME = PackageUtil.name;

/** 扩展名称 */
const EXTENSION_NAME = translate('name');

/**
 * 面板管理器 (主进程)
 */
const PanelManager = {

    /**
     * 打开预览面板
     */
    openViewPanel() {
        Editor.Panel.open(`${PACKAGE_NAME}.view`);
    },

    /**
     * 获取预览面板
     * @returns {Electron.WebContents | null}
     */
    getViewPanel() {
        const panel = Editor.Panel.findWindow(`${PACKAGE_NAME}.view`);
        if (panel) {
            const webContents = panel.nativeWin.webContents;
            return webContents;
        }
        return null;
    },

    /**
     * 设置面板实例
     * @type {BrowserWindow}
     */
    settings: null,

    /**
     * 打开设置面板
     */
    openSettingsPanel() {
        // 已打开则直接展示
        if (PanelManager.settings) {
            PanelManager.settings.show();
            return;
        }
        // 窗口高度和位置
        const winSize = [500, 290],
            winPos = calcWindowPosition(winSize, 'center');
        // 创建窗口
        const win = PanelManager.settings = new BrowserWindow({
            width: winSize[0],
            height: winSize[1],
            minWidth: winSize[0],
            minHeight: winSize[1],
            x: winPos[0],
            y: winPos[1] - 100,
            useContentSize: true,
            frame: true,
            title: `${EXTENSION_NAME} | Cocos Creator`,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: false,
            alwaysOnTop: true,
            hasShadow: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // 就绪后展示（避免闪烁）
        win.on('ready-to-show', () => win.show());
        // 关闭后
        win.on('closed', () => (PanelManager.settings = null));
        // 监听按键
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') PanelManager.closeSettingsPanel();
        });
        // 调试用的 devtools（detach 模式需要取消失焦自动关闭）
        // win.webContents.openDevTools({ mode: 'detach' });
        // 加载页面
        const path = join(__dirname, '../renderer/settings/index.html');
        win.loadURL(`file://${path}?lang=${language}`);
    },

    /**
     * 关闭设置面板
     */
    closeSettingsPanel() {
        if (!PanelManager.settings) {
            return;
        }
        PanelManager.settings.hide();
        PanelManager.settings.close();
        PanelManager.settings = null;
    },

};

module.exports = PanelManager;
