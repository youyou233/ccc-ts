"use strict"
const fs = require("fs")
;("use strict")

const COM_ITEM = "item"
const COM_NODE = "cc.Node"

const VIEW_PANEL = 1
const VIEW_ITEM = 2
const regList = new RegExp("List[0-9]*$")

const TIPS = `// -------------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED BY UI TOOL, SO PLEASE DON'T MODIFY IT BY YOURSELF!
// -------------------------------------------------------------------------------`

function getAllChildNode(root) {
    let arrChild = []
    if (null != root.children) {
        root.children.forEach((it) => {
            arrChild.push(it)
            // Editor.log("----------- it " + it.name)
        })
    }

    let index = 0
    while (index < arrChild.length) {
        let curNode = arrChild[index]
        let arr = curNode.children
        if (null != arr && arr.length > 0) {
            arr.forEach((it) => {
                arrChild.push(it)
                // Editor.log("----------- it " + it.name)
            })
        }

        index++
    }

    return arrChild
}

function getNodePath(node) {
    let path
    while (node && !(node instanceof cc.Scene)) {
        if (path) {
            path = node.name + "/" + path
        } else {
            path = node.name
        }
        node = node.parent
    }
    return path
}

function getNodePathUnincludeRoot(node, root) {
    let path
    while (node && node != root && !(node instanceof cc.Scene)) {
        if (path) {
            path = node.name + "/" + path
        } else {
            path = node.name
        }
        node = node.parent
    }
    return path
}

function buildComponentCode(item, root, strType) {
    let path = ""
    let name = ""
    let strBody = ""

    let showCom = false
    if (strType == COM_ITEM || strType == COM_NODE) {
        name = item.name
        path = getNodePathUnincludeRoot(item, root)
    } else {
        name = item.node.name
        path = getNodePathUnincludeRoot(item.node, root)
        showCom = true
    }
    if (regList.test(name)) {
        let base = name.match(regList)
        let baseInfo = base[0].replace("List", "List[")
        name = name.replace(base[0], baseInfo + "]")
    }
    if (showCom) {
        strBody = cc.js.formatStr('\t\tthis.%s = cc.find("%s", root)?.getComponent(%s)\n', name, path, strType)
    } else {
        strBody = cc.js.formatStr('\t\tthis.%s = cc.find("%s", root)\n', name, path)
    }

    return strBody
}

let nameList = {}
function defindVar(item, strType) {
    let orName = ""
    if (strType == COM_ITEM || strType == COM_NODE) {
        orName = item.name
    } else {
        orName = item.node.name
    }
    if (regList.test(orName)) {
        let name = orName.replace(regList, "List")
        //如果已经有数组引用就不再写入
        if (nameList[name]) {
            return ""
        }
        nameList[name] = true
        return cc.js.formatStr("\t%s: Array<%s> = []\n", name, strType)
    } else {
        return cc.js.formatStr("\t%s: %s = null\n", orName, strType)
    }
}
let destroyMap = {}
function destroyVar(item, strType) {
    let orName = ""
    if (strType == COM_ITEM || strType == COM_NODE) {
        orName = item.name
    } else {
        orName = item.node.name
    }
    if (regList.test(orName)) {
        let name = orName.replace(regList, "List")
        //如果已经有数组引用就不再写入
        if (destroyMap[name]) {
            return ""
        }
        destroyMap[name] = true
        return cc.js.formatStr("\t\tthis.%s = []\n", name)
    } else {
        return cc.js.formatStr("\t\tthis.%s = null\n", orName)
    }
}

function getComponentsInChild(strReg, arrComponent, rootName, isNode = false) {
    let arr = new Array()
    let reg = new RegExp(strReg)
    arrComponent.forEach((it) => {
        let arrMatch = it.name.match(reg)
        // Editor.log(`Item name : ${it.name} Node name : ${it.node.name} Reg : ${regStr} arrMatch : ${arrMatch}`)
        if (null != arrMatch && 1 == arrMatch.length && !isChildOnItem(it, rootName, isNode)) {
            arr.push(it)
        }
    })

    return arr
}

// function getNodesInChild(srtType, strReg, arrComponent, rootName){
//     let arr = new Array()
//     let reg = new RegExp(strReg)
//     arrComponent.forEach((it) => {
//         let arrMatch = it.name.match(reg)
//         // Editor.log(`Item name : ${it.name} Node name : ${it.node.name} Reg : ${regStr} arrMatch : ${arrMatch}`)
//         if (null != arrMatch && 1 == arrMatch.length && !isChildOnItem(it, rootName)) {
//             arr.push(it)
//         }
//     })

//     return arr
// }

// 是否为Item的子物体
function isChildOnItem(com, rootName, isNode) {
    let node = com
    if (!isNode) {
        node = com.node
    }

    while (null != node.parent) {
        if (node.parent.name == rootName) {
            break
        } else if (node.parent.name.startsWith(COM_ITEM) && node.parent.name != rootName) {
            return true
        }

        node = node.parent
    }

    return false
}

function getPanelClassName(nodeName) {
    let className = ""
    let array = nodeName.split("_")
    for (let i = 0; i < array.length; i++) {
        if (array[i] == "ui") {
            array[i] = "UI"
        } else {
            array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length)
        }
        className += array[i]
    }
    return className + "View"
}

function getItemClassName(nodeName) {
    nodeName = nodeName.replace(regList, "")
    let className = nodeName[0].toUpperCase() + nodeName.substring(1, nodeName.length)
    return className + "View"
}

function getFileName(nodeName) {
    return nodeName + "_view.ts"
}

function getItemFileName(nodeName) {
    nodeName = nodeName.replace(regList, "")
    let className = ""
    let len = nodeName.length
    for (let i = 0; i < len; i++) {
        let char = nodeName[i]
        if ("A" <= char && "Z" >= char) {
            char = char.toLowerCase()
            className += "_" + char
        } else {
            className += char
        }
    }

    return className + "_view.ts"
}

function saveFile(filePath, strData) {
    fs.writeFile(filePath, strData, { flag: "w+" }, (err) => {
        if (err) {
            Editor.error(`Create file ${filePath} err: ${err}`)
        } else {
            Editor.log(`Create file ${filePath} finish !`)
        }
    })
}

function buildInitViewFunc(strBody) {
    return cc.js.formatStr("\tinitView(root : cc.Node) {\n%s\t}\n\n", strBody)
}

function buildOnDestroyFunc(strBody) {
    return cc.js.formatStr("\tonDestroy() {\n%s\t}\n\n", strBody)
}

// root ：root node
function createPanelScript(root) {
    let className = getPanelClassName(root.name)
    let fileName = getFileName(root.name)
    let strBody = buildScriptBody(root, VIEW_PANEL)

    let strData = cc.js.formatStr("%s\nexport default class %s {\n%s\n}", TIPS, className, strBody)
    let saveFolder = `${Editor.Project.path}/assets/scripts/ui_view/panel`
    let savePath = saveFolder + "/" + fileName
    if (!fs.existsSync(saveFolder)) {
        _mkDir(saveFolder)
    }
    saveFile(savePath, strData)
    // Editor.assetdb.refresh(`db://assets/scripts/ui_view/item`)
}
function _mkDir(filePath) {
    const arr = filePath.split("/")
    let dir = arr[0]
    for (let i = 1; i <= arr.length; i++) {
        if (dir != "") {
            if (fs.existsSync(dir)) {
            } else {
                fs.mkdirSync(dir)
            }
        }
        dir += "/" + arr[i]
    }
    // fs.writeFileSync(filePath, "")
}

// root ：root node
function createItemScript(root) {
    if (root.name.startsWith(COM_ITEM)) {
        let className = getItemClassName(root.name)
        let fileName = getItemFileName(root.name)
        let strBody = buildScriptBody(root, VIEW_ITEM)

        let strData = cc.js.formatStr("%s\nexport default class %s {\n%s\n}", TIPS, className, strBody)
        let saveFolder = `${Editor.Project.path}/assets/scripts/ui_view/item`
        let savePath = saveFolder + "/" + fileName
        if (!fs.existsSync(saveFolder)) {
            _mkDir(saveFolder)
        }
        saveFile(savePath, strData)
        // Editor.assetdb.refresh(`db://assets/scripts/ui_view/item`)
    } else {
        Editor.error("Cur node is not item !")
    }
}

function buildScriptBody(root, viewType) {
    nameList = {}
    destroyMap = {}
    var tabRegex = []
    // node
    // tabRegex["cc.Node"] = "^node(?:[A-Z]+[a-z0-9^_]*)+$"
    tabRegex["cc.Button"] = "^btn(?:[A-Z]+[a-z0-9^_]*)+<Button>$" // button
    tabRegex["cc.Label"] = "^lab(?:[A-Z]+[a-z0-9^_]*)+<Label>$" // label
    tabRegex["cc.Sprite"] = "^spr(?:[A-Z]+[a-z0-9^_]*)+<Sprite>$" // Sprite
    tabRegex["cc.RichText"] = "^rt(?:[A-Z]+[a-z0-9^_]*)+<RichText>$" // RichText
    tabRegex["cc.ScrollView"] = "^sv(?:[A-Z]+[a-z0-9^_]*)+<ScrollView>$" // ScrollView
    tabRegex["cc.ProgressBar"] = "^bar(?:[A-Z]+[a-z0-9^_]*)+<ProgressBar>$" // ProgressBar
    tabRegex["cc.EditBox"] = "^editbox(?:[A-Z]+[a-z0-9^_]*)+<EditBox>$" // EditBox
    tabRegex["cc.Toggle"] = "^tog(?:[A-Z]+[a-z0-9^_]*)+<Toggle>$" // toggle
    tabRegex["cc.ToggleContainer"] = "^togcon(?:[A-Z]+[a-z0-9^_]*)+<ToggleContainer>$" // ToggleContainer
    tabRegex["cc.Layout"] = "^layout(?:[A-Z]+[a-z0-9^_]*)+<Layout>$" // Layout
    tabRegex["cc.VideoPlayer"] = "^vp(?:[A-Z]+[a-z0-9^_]*)+<VideoPlayer>$" // VideoPlayer
    tabRegex["sp.Skeleton"] = "^sp(?:[A-Z]+[a-z0-9^_]*)+<Skeleton>$" // ToggleContainer
    tabRegex["cc.ParticleSystem"] = "^ps(?:[A-Z]+[a-z0-9^_]*)+<ParticleSystem>$" // ToggleContainer
    tabRegex["cc.Slider"] = "^sld(?:[A-Z]+[a-z0-9^_]*)+<Slider>$" // ToggleContainer
    tabRegex["cc.MotionStreak"] = "^ms(?:[A-Z]+[a-z0-9^_]*)+<MotionStreak>$" // ToggleContainer
    tabRegex["cc.Animation"] = "^anim(?:[A-Z]+[a-z0-9^_]*)+<Animation>$" // ToggleContainer
    // item
    // tabRegex["item"] = "^item(?:[A-Z]+[a-z0-9^_]*)+$"

    let strDefine = ""
    let strContent = ""
    let strDestroy = ""

    let arrNode = getAllChildNode(root)
    if (null != arrNode) {
        let arrChild = getComponentsInChild("^node(?:[A-Z]+[a-z0-9^_]*)+$", arrNode, root.name, true)
        if (arrChild.length > 0) {
            arrChild.forEach((it) => {
                strDefine += defindVar(it, COM_NODE)
                strContent += buildComponentCode(it, root, COM_NODE)
                // strContent += cc.js.formatStr("\tthis.%s = cc.find("content/partOne/btnConfirm", root).getComponent(cc.Button)",it.node.name)
                strDestroy += destroyVar(it, COM_NODE)
            })
            strDefine += "\n"
            strContent += "\n"
            strDestroy += "\n"
        }

        arrChild = getComponentsInChild("^item(?:[A-Z]+[a-z0-9^_]*)+$", arrNode, root.name, true)
        // Editor.log(" Item len : " + arrChild.length)
        if (arrChild.length > 0) {
            arrChild.forEach((it) => {
                // Editor.log("----------- Item Name " + it.name)
                strDefine += defindVar(it, COM_NODE)
                strContent += buildComponentCode(it, root, COM_NODE)
                strDestroy += destroyVar(it, COM_NODE)
            })
            strDefine += "\n"
            strContent += "\n"
            strDestroy += "\n"
        }
    }

    let components = root.getComponentsInChildren(cc.Component) // 获取所有 component
    for (var key in tabRegex) {
        // Editor.log(key + "->" + tabRegex[key])
        let arrCon = getComponentsInChild(tabRegex[key], components, root.name)
        if (null != arrCon && arrCon.length > 0) {
            arrCon.forEach((it) => {
                strDefine += defindVar(it, key)
                strContent += buildComponentCode(it, root, key)
                strDestroy += destroyVar(it, key)
            })

            strDefine += "\n"
            strContent += "\n"
            strDestroy += "\n"
        }
    }

    if (VIEW_PANEL == viewType) {
        strDefine = "\tcontent: cc.Node = null\n\n" + strDefine
        strContent = '\t\tthis.content = cc.find("content", root)\n\n' + strContent
        strDestroy = "\t\tthis.content = null\n\n" + strDestroy
    }

    let strBody = strDefine + "\n"
    strBody += buildInitViewFunc(strContent)
    strBody += buildOnDestroyFunc(strDestroy)

    // Editor.log(`All component :\n${strDefine}\n${strContent}\n${strDestroy}`)
    return strBody
}

module.exports = {
    get_canvas_children: function (event) {
        var canvas = cc.find("Canvas")
        var len = 0
        if (null != canvas) {
            len = canvas.children.length
        }

        Editor.log("children length : " + len)

        if (event.reply) {
            event.reply(null, len)
        }
    },

    getPanelInfo: function (event) {
        var info = ""
        var strError = ""
        var scene = cc.director.getScene()
        if (!scene) {
            if (CC_DEV) {
                cc.warnID(5601)
            }
            // Editor.log('scene is null')
            strError = "scene is null"
        } else if (CC_DEV && !scene.isValid) {
            cc.warnID(5602)
            // Editor.log('scene.isValid false')
            strError = "scene.isValid false"
        }
        // if (CC_DEV && null != referenceNode && !referenceNode.isValid) {
        //     cc.warnID(5603);
        //     return null;
        // }
        if (strError == "") {
            var children = scene._children
            for (var t = 0, len = children.length; t < len; ++t) {
                var subChild = children[t]
                info += subChild.name + ","
            }
        }

        // Editor.log('Info : ' + info);
        if (event.reply) {
            if (strError != "") {
                event.reply(strError, "")
            } else {
                event.reply(null, info)
            }
        }
    },

    showSelectInfo: function (event) {
        // 获取场景中选中的节点
        let selected = Editor.Selection.curSelection("node")
        let rootUUID
        if (selected.length > 0) {
            rootUUID = selected[0]
        }

        if (null != rootUUID) {
            let node = cc.engine.getInstanceById(rootUUID) //获取当前选中的节点
            Editor.log(`Root uuid : ${rootUUID} Name : ${getNodePath(node)}`)

            let sprites = node.getComponentsInChildren(cc.Sprite) // 获取所有 sprite
            let info = ""
            for (var i = 0, len = sprites.length; i < len; ++i) {
                let subChild = sprites[i]
                // scene 场景下取不到 let atlasName = null != subChild.spriteAtlas ? subChild.spriteAtlas.name : "空";
                let spriteName = null != subChild.spriteFrame ? subChild.spriteFrame.name : "null"
                // info += `Path : ${getNodePath(subChild.node)},SpriteName : ${spriteName}\n`;
                info += `${getNodePath(subChild.node)},${spriteName}\n`
            }
            Editor.log(`SelectInfo :\n${info}`)

            // let sprites = node.getComponentsInChildren(cc.Sprite); // 获取所有 sprite
            // let info = '';
            // for (var i = 0, len = sprites.length; i < len; ++i) {
            //     let subChild = sprites[i];
            //     let atlasUUId = null != subChild.spriteAtlas ? subChild.spriteAtlas.uuid : "空";
            //     let spriteUUId = null != subChild.spriteFrame ? subChild.spriteFrame.uuid : "空";
            //     info += `Name : ${subChild.name} Atlas : ${Editor.assetdb.uuidToUrl(atlasUUId)} SpriteName : ${Editor.assetdb.uuidToUrl(spriteUUId)}\n`;
            // }
            // Editor.log(`SelectInfo :\n${info}`);
        } else {
            Editor.log("Root is null !")
        }
    },

    showSelectInfoNoSame: function (event) {
        // 获取场景中选中的节点
        let selected = Editor.Selection.curSelection("node")
        let rootUUID
        if (selected.length > 0) {
            rootUUID = selected[0]
        }

        if (null != rootUUID) {
            let dic = new Array()
            let node = cc.engine.getInstanceById(rootUUID) //获取当前选中的节点
            Editor.log(`Root uuid : ${rootUUID} Name : ${getNodePath(node)}`)

            let sprites = node.getComponentsInChildren(cc.Sprite) // 获取所有 sprite
            let info = ""
            for (var i = 0, len = sprites.length; i < len; ++i) {
                let subChild = sprites[i]
                // scene 场景下取不到 let atlasName = null != subChild.spriteAtlas ? subChild.spriteAtlas.name : "空";
                let spriteName = null != subChild.spriteFrame ? subChild.spriteFrame.name : "null"
                // info += `Path : ${getNodePath(subChild.node)},SpriteName : ${spriteName}\n`;
                if (null == dic[spriteName]) {
                    info += `${getNodePath(subChild.node)},${spriteName}\n`
                    dic[spriteName] = true
                }
            }
            Editor.log(`SelectInfo :\n${info}`)
        } else {
            Editor.log("Root is null !")
        }
    },

    btnCreatePanelScript: function (event) {
        // 获取场景中选中的节点
        let selected = Editor.Selection.curSelection("node")
        let rootUUID
        if (selected.length > 0) {
            rootUUID = selected[0]
        }

        if (null != rootUUID) {
            let node = cc.engine.getInstanceById(rootUUID) //获取当前选中的节点
            // Editor.log(`Root uuid : ${rootUUID} Name : ${getNodePath(node)}`)
            createPanelScript(node)
            // let components = node.getComponentsInChildren(cc.Component); // 获取所有 sprite
            // let info = '';
            // Editor.log('len' + components.length);
            // for (var i = 0, len = components.length; i < len; ++i) {
            //     let subChild = components[i];
            //     info += `${getNodePath(subChild.node)}\n`;
            // }
            // Editor.log(`All component :\n${info}`);
        } else {
            Editor.log("Root is null !")
        }
    },

    btnCreateItemScript: function (event) {
        // 获取场景中选中的节点
        let selected = Editor.Selection.curSelection("node")
        let rootUUID
        if (selected.length > 0) {
            rootUUID = selected[0]
        }

        if (null != rootUUID) {
            let node = cc.engine.getInstanceById(rootUUID) //获取当前选中的节点
            // Editor.log(`Root uuid : ${rootUUID} Name : ${getNodePath(node)}`)
            createItemScript(node)
        } else {
            Editor.log("Root is null !")
        }
    },
}
