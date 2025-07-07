import path from "path"
import { isDev } from "./util.js"
import { app } from "electron"

export function getPreloadPath() {
    return isDev() 
    ? path.join(app.getAppPath(), "/dist-electron/preload.js")
        : path.join(process.resourcesPath, "preload.js");

    // return path.join(
    //     app.getAppPath(),
    //     isDev() ? '.' : '..',
    //     '/dist-electron/preload.js'
    // );
}
