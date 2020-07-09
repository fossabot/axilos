import Electron, { BrowserWindow, app } from 'electron';
import path from 'path';
import { default as urlLib } from 'url';

import useStorage from './useStorage';
const storage = useStorage("options");

class ElectronWindow {
    public appWindow: Electron.BrowserWindow;

    constructor(props:{
        incognito?: boolean,
        firstRun?: boolean
    } = {}) {
        let url;

        this.appWindow = new BrowserWindow({
            width: 800,
            height: 600,
            transparent: true,
            titleBarStyle: 'hiddenInset',
            frame: false,
            webPreferences: {
              nodeIntegration: true,
            },
            show: false,
            icon: path.join(app.getAppPath(), `build/img/axilos_logo${process.env.NODE_ENV === "development" ? "_nightly" : ""}_256.png`)//(process.platform !== "darwin") ? path.resolve(__dirname, "../../public/img/axilos_logo.ico") : undefined,
        });
        
        url = urlLib.format({
            pathname: path.join(app.getAppPath(), '/build/index.html'),
            protocol: 'file:',
            slashes: true
        });

        props.firstRun = this.isFirstRun();
        if (props.firstRun) this.appWindow.setResizable(false);

        url += "?props=" + JSON.stringify(props);

        this.appWindow.once('ready-to-show', this.appWindow.show);
        this.appWindow.loadURL(url);
          
        this.appWindow.on('closed', () => {
            this.appWindow = null;
        });
    }

    registerEventListeners = () => {

    }

    isFirstRun = () => !storage.get('verified').value()
}

export default ElectronWindow;