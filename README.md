# cocoscreator TS版本脚本规范

## 框架介绍
### 0.介绍
这是一个轻量级的cocoscreatorTS 2d框架。它是单个scene，然后绝大部分UI可以动态读取打开和关闭，将UI从scene中分开可以尽可能保证协作时代码不冲突。还加入了一些整合好的轻量资源管理器，对象池管理等等。
### 1. 重要组件介绍
- 游戏主入口`MainManager`进入 改脚本挂载在canvas上
- 公共游戏数据存取管理器`DynamicDataManager`
- 资源加载文件 `ResourcesManager` 所有资源文件夹配置相关写config.ts 中
- 游戏Json文件管理 `JsonManager` 配合`ResourcesManager`使用 导表工具 https://github.com/koalaylj/xlsx2json  
- 对象池管理组件 `PoolManager` 配合`ResourcesManager`使用
- 本地存储管理 `StorageManager` 
- UI管理器 `UIManager` 
- 事件观察组件组件 `Emitter`
- 枚举 'enum' 所有的枚举写在这个里面

### 2.资源动态加载
- 在资源加载完毕之前不要使用未加载完成的资源，会导致报错
- 可以拓展`ResourcesManager`以加载任何你想动态加载的资源，你可以一开始就加载，也可以在使用时加载并存储起来以便二次读取
- 需要一开始就加载的资源应该写在配置中，我写在了config的resfig下，你如果不想记住每个ui的名字可以想我一样将Ui的名字写在config的uiName下

### 3. UI管理
- ui脚本模板参考
```javascropt
//文件名 home_ui.ts 位于文件夹assets/scripts/ui下
const { ccclass, property } = cc._decorator
@ccclass
export default class HomeUI extends cc.Component {
    static instance: HomeUI = null
    _view: HomeUIView = new HomeUIView()
    onLoad() {
        this._view.initView(this.node)
        HomeUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.btnBack.node.on("click", this.hideUI, this)
        this._view.nodeMask.on("click", this.hideUI, this)
        //Emitter.register(MessageType.XXXXXX, this._refresh, this)
    }
    
    showUI() {
        this._view.content.active = true
    }

    hideUI() {
        this._view.content.active = false
    }
}

```
- 将UI制作好之后以预制体的形式放入resources/ui文件夹下，在config中配置ui的文件名，创建UI脚本并且绑定到ui上，然后可以使用UIManager.instance.openUI调用，例如：
 `UIManager.instance.openUI(SettingUI, { name: Config.uiName.settingUI })`
- 每个可以动态呼出的UI包含一个content 和一个mask，content用来控制当前UI的显示与否，mask可以作为玩家点击空白处关闭UI的按钮
- 如果按照一定的规则命名之后（node-,btn-,lab-,bar-等等），可以使用动态绑定，选择ui节点后在拓展里面点击UITools->createPanelScript,然后在对应的脚本里声明`_view:xxxxUIView=new xxxxUIView()`,并且在onLoad中进行初始化，  `this.view.initView(this.node)`
- 动态绑定同样可以对一个item使用
- 一个页面应该由一个UI组件控制，一个弹框也应该由一个UI组件控制

### 4.instance
- instance参考unity中C#的写法，将一个类实例化（可以在第一次实例化时初始化），从而可以直接去访问这个类的**公共属性或方法**

### 5.emmiter
- 观察者模式可以方便游戏的开发所以我也将他整合了进来

### 6.util
- 你可以在util工具箱中写下你常用的函数以便任何时间任何地点调用

## 插件安装
### 1. beautify (推荐)
美化插件 代码格式化快捷键 alt+shift+F

### 2. TSLint && ESLint

### 3. GitLens
vscode上的git管理插件

### 4. TODO HighLight (推荐)
todo高亮

### 5. ccc自带的拓展

## ts的基本介绍与使用
### 1. 类型检查
如果传入的数据类型和声明的类型不一样会报错提示
>eg changeReviveItem(num: number){} 则num必须传入number类型

### 2. 语法提示
强大的语法提示功能，按住ctrl然后鼠标点击函数即可快速跳转。输入任何一个类便可自动引入。

### 3. 支持ES6特性
可使用异步promiss,拓展符,解构等等


## 命名规范
### 1. ts文件名称  
采用全部小写+下划线方式  
>eg : dynamic_data_manager

### 1. ts类名  
采用首字母大写驼峰命名  
>eg：PreStartPage、GameController、Scripts、CardPrefab

### 3. 脚本中
1. 函数命名：采用首字母小写驼峰命名,必须能完整描述作用，用**动词**开头  
>eg : onGameOver、getGameData、updatePlayerPosition
2. 变量命名：采用首字母小写驼峰命名,必须能完整描述作用，用**修饰词**开头
3. 常量命名：采用全大写的命名，且单词以_（下划线）分割 
>eg : MONSTER_MAX_NUM=10
4. （私有）专有属性：采用首字母小写驼峰命名，必须在名称前加_（下划线） 
>eg _instance=null



### 4. 开放接口，封闭实现

- 面向对象编程的一个原则称为**开放-封闭原则**，简称**OCP**（Open-Closed Principle）。
- 意即对扩展开放，对修改关闭。
- 别的同学在使用你写的组件时，应该只要知道你的组件有哪些接口、如何调用就好，而无须关心你具体代码是怎么写的。
- 你写的每一个 class ，都应该时刻**为他人着想**，考虑他人如何调用你的组件最方便。宁可自己多写点代码，也不要把麻烦留给他人。
- 即使是只给自己用的 class，也应该尽力遵守这个**OCP**原则，这是程序员的基本功。


## 常用git操作
项目使用git托管代码

特别注意：开始编码前和上传代码前务必先`git pull`从远程代码库拉取最新代码。

git常用命令

`git add .`将修改增加的代码提交暂存处

`git commit -m 'commit message'`提交暂存处代码到本地版本库

`git push`提交本地代码到远程分支

`git branch`查看当前git分支

`git checkout branchName`切换当前分支到branchName分支

`git pull`拉取远程分支内容更新本地分支

# 使用 JSDoc 规范添加注释

- [JSDoc 官方手册（英文）](http://usejsdoc.org/)
- [JSDoc 中文参考手册](https://yuri4ever.github.io/jsdoc/)
- 以 `/**` 开头（有两个星号），另起一行，然后每行以 ` * `（一个空格、一个星号、再一个空格）开头，最后一行以 ` */` （空格、星号、斜杠）结束
- 在每个 ts **文件开头**，**必须**添加文件注释。
  - 必须项：`@file`（文件描述）`@author`（作者名字或昵称）`@date`（文件创建日期）
  - 可选项：`@description`（更详细的文件描述），此外还可以自由添加更多注释项（参考 JSDoc 手册）。
```javascript
/**
 * 主控制器
 * @file 整个游戏的入口脚本
 * @author uu
 * @date 2018/12/15
 */
```
- 在每个 function 和每个带有 `public` 或 `export` 光环的变量、方法、接口、函数等，开头**都必须**添加注释。
  - 注释第一行写上描述。
  - 必须项（若有参数）： `@param {type} name - description`，参数类型和说明，每个参数一行。
  - 必须项（若有返回值）： `@returns {type} description`。
  - 若是在别人创建的文件里添加 function，建议针对你的 function 单独加上 `@author` 留下你的大名（以及时间 `@date`）。
  - 鼓励自由发挥添加更多注释，但请尽量地遵守 JSDoc 规范。
  - 示例：
```javascript
/**
 * 读取存档
 * @param {string} id - 存档号
 * @returns {string} 获得的存档
 * @author uu
 * @date 2018/12/15
 */
getLoadById(id:number){
    //XXXXXXXX
    return {}
};
```
- class 可以不用添加注释，因为我们规定，每个文件应该只包含一个 class。请在文件开头使用 `@file` 和 `@description （可选）` 注释 class 的用途。