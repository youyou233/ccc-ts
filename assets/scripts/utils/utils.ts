import GameUI from "../ui/game_ui"

export class Utils {
    /**
     * 深拷贝
     * @param obj 对象
     */
    static deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {}
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    result[key] = this.deepCopy(obj[key]) //递归复制
                } else {
                    result[key] = obj[key]
                }
            }
        }
        return result
    }

    // static deepCopyDamageDate(data: DamageData): DamageData {
    //     return {
    //         atk: data.atk || 0,
    //         realAtk: data.realAtk || 0,
    //         magicAtk: data.magicAtk || 0,
    //         from: data.from || null,
    //         hit: data.hit || 0,
    //         skill: data.skill || 0,
    //         double: data.double || false,
    //         total: data.total || 0,
    //         cri: data.cri || 0,
    //         atkType: data.atkType || RootType.none,
    //         hitCb: data.hitCb || null,
    //         group: data.group || GroupType.none,
    //         effectName: data.effectName || null,
    //         effectPos: data.effectPos || null
    //     }
    // }
    /**
     * 查找数组中的ID为某项
     * @param arr 
     * @param key 要查找的字段名称
     * @param data 
     */
    static arrFind(arr: any[], key: string, data: any) {
        for (let i = 0, length = arr.length; i < length; i++) {
            if (arr[i][key] == data) {
                return [arr[i], i]
            }
        }
    }

    /**
     * 获取百分百字符串
     * @param val 1则为 100.00%
     */
    static getPercentStr(val: number): string {
        var str = Number(val * 100).toFixed(2)
        str += "%"
        return str
    }

    /**
     * 快排
     * @param source_arr
     * @param selector
     */
    static orderBy(source_arr, selector): any {
        if (source_arr.length <= 1) {
            return source_arr
        }
        const pivotIndex = Math.floor(source_arr.length / 2)
        const pivot = source_arr.splice(pivotIndex, 1)[0]
        const left = []
        const right = []
        for (const i of source_arr) {
            if (selector(i) < selector(pivot)) {
                left.push(i)
            } else {
                right.push(i)
            }
        }
        return Utils.orderBy(left, selector).concat([pivot], Utils.orderBy(right, selector))
    }


    /**
     * 生成随机数 0-max
     * @param {number} max 最大值
     * @returns {number}
     */
    static getRandomNumber(max: number): number {
        return Math.floor(Math.random() * (max + 1))
    }
    /**
     * 获取时间 返回一个对象
     * @param time 
     */
    static getLocalTime(time) {
        let finDate = {}
        let date = new Date(time * 1000)
        finDate["y"] = date.getFullYear()
        finDate["m"] = date.getMonth() + 1
        finDate["d"] = date.getDate()
        return finDate
    }

    static getGameTime(time) {
        let finDate: any = {}
        //  let date = new Date(time * 1000 * 24 * 3600)
        finDate["y"] = Math.floor((time - 1) / 28 / 4) + 1
        finDate["m"] = Math.floor((time - 1) / 28) % 4 //季节
        finDate["d"] = time % 28
        finDate['w'] = time % 7 - 1
        if (finDate['d'] == 0) finDate['d'] = 28
        if (finDate['w'] == -1) finDate['w'] = 6
        return finDate
    }

    /**
        * 获取json的长度
        * @param jsonData
        */
    static getJsonLength(jsonData: JSON): number {
        let jsonLength = 0
        for (let item in jsonData) {
            jsonLength++
        }
        return jsonLength
    }
    /**
     * 打印对象
     * @param obj
     */
    static printObj(obj) {
        var description = ""
        for (var i in obj) {
            var property = obj[i]
            description += i + " = " + property + "\n"
        }
        console.log(description)
    }
    /**
     * 检测是否包含字符串
     * @param str
     * @param data
     */
    static isContain(str: string, data: string): boolean {
        if (str != null) {
            var index = str.indexOf(data)
            if (index > -1) {
                return true
            }
        }

        return false
    }

    /**
     * 检测对象中是否包含相应key
     * @param obj
     * @param objkey
     */
    static isIn(obj: object, objkey: string): any {
        if (obj != null) {
            for (let key in obj) {
                if (obj[key] == objkey) {
                    return key
                }
            }
        }

        return false
    }
    //获得格式化的大数值
    static getLargeNumStr(val: number): string {
        // if (val >= 10000000000) {
        //     return (val / 1000000000).toFixed(1) + "B"
        // } else if (val >= 10000000) {
        //     return (val / 1000000).toFixed(1) + "M"
        // } else if (val >= 10000) {
        //     return (val / 1000).toFixed(1) + "K"
        // }
        // return Math.floor(val).toString()
        if (val >= 99999999) {
            return (val / 100000000).toFixed(2) + "亿"
        } else if (val >= 10000) {
            return (val / 10000).toFixed(2) + "万"
        } else {
            return Math.floor(val).toString()
        }
    }
    /**
     * 获取时间分和秒 格式00：00
     * @param time 
     */
    static getTimeFormat(time: number): string {
        if (time < 0) {
            return "00:00"
        }

        let min = Math.floor(time / 60)
        let sec = Math.floor(time - min * 60)

        if (min < 10 && sec < 10) {
            return "0" + min.toString() + ":" + "0" + sec.toString()
        } else if (min < 10 && sec >= 10) {
            return "0" + min.toString() + ":" + sec.toString()
        } else if (min >= 10 && sec < 10) {
            return min.toString() + ":" + "0" + sec.toString()
        } else if (min >= 10 && sec >= 10) {
            return min.toString() + ":" + sec.toString()
        }
        return "00:00"
    }

    /**
     * 从时间戳的差判断是多久以前
     * @param time 
     */
    static getTimeFromNowStr(time: number): string {
        if (time <= 60) {
            return "刚刚"
        }
        let min = Math.floor(time / 60)
        let hour = Math.floor(time / 3600)
        let day = Math.floor(time / 84600)

        if (day >= 1) {
            return day + "天以前"
        }
        if (hour >= 1) {
            return hour + "小时以前"
        }
        if (min >= 1) {
            return min + "分以前"
        }
    }


    static setSpScale(node: cc.Node, size: number) {
        node.scale = 1
        if (node.width > node.height) {
            // if (node.width > size) {
            node.scale = size / node.width

        } else {
            // if (node.height > size)
            node.scale = size / node.height
        }
    }
    /**
    * 根据二维向量获取角度
    * @param pos 
    * @returns 
    */
    static getAngle(pos: cc.Vec3 | cc.Vec2) {
        return Math.atan2(pos.y, pos.x) * 180 / Math.PI
    }
    /**
     * 根据角度获取向量
     * @param angle 
     * @returns 
     */
    static getNormalDivByAngel(angle) {
        return cc.v2(
            Math.cos(angle / 180 * Math.PI), Math.sin(angle / 180 * Math.PI)
        )
    }
    /**
     * 判断随机概率是否成功
     * @param num 
     * double//0不双重 1 双重取好 2 双重取坏
     * @returns 
     */
    static luckChance(num: number, double: number = 0) {
        let luck = (this.getRandomNumber(9999) + 1) / 100
        if (double) {
            let luck2 = (this.getRandomNumber(9999) + 1) / 100
            return num > luck || num > luck2
        }
        return num > luck
    }

    /**
     * 提供一个概率组，随机返回一个概率的Index
     * @param arr 
     * @returns 
     */
    static getArrRandomIndex(arr: any[]) {
        let all = 0
        arr.forEach((item, index) => {
            all += item
        })
        let random = this.getRandomNumber(all - 1) + 1
        let targetIndex = 0
        for (let i = 0; i < arr.length; i++) {
            if (random <= arr[i]) {
                targetIndex = i
                break
            } else {
                random -= arr[i]
            }
        }
        return targetIndex
    }
    /**
     * 随机返回数组中的某一项
     * @param arr 
     * @returns 
     */
    static getArrRandomItem(arr: any[]) {
        if (!arr) return null
        return arr[this.getRandomNumber(arr.length - 1)]
    }

    //随机返回数组中某几项
    static getArrRandomItemsByNum(list: any[], num: number) {
        let count = list.length - num
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                let index = Utils.getRandomNumber(list.length - 1)
                list.splice(index, 1)
            }
            return list
        } else {
            return list
        }
    }

    /**
     * 找到数组中的某一项
     * @param target 
     * @param arr 
     */
    static myIndexOf = function (arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (JSON.stringify(arr[i]) == JSON.stringify(el)) {
                return i;
            }
        }
        return -1;
    }

    //获取椭圆上的一点
    static getEllipsePoints(a: number, b?: number, radio?: number, originPos: number[] = [0, 0]) {
        if (!b) b = a
        if (!radio) radio = Utils.getRandomNumber(360)
        radio = radio / 180 * Math.PI
        let x = a * Math.sin(radio)
        let y = b * Math.cos(radio)
        x += originPos[0]
        y += originPos[1]
        return [x, y]
    }

    static getRealDistance(node1: cc.Node, node2: cc.Node) {
        let distance = node1.getPosition().sub(node2.getPosition()).mag()
        let targetRadio = node1.getComponent(cc.PhysicsCircleCollider).radius
        let selfRadio = node2.getComponent(cc.PhysicsCircleCollider).radius
        return distance - targetRadio - selfRadio
    }
    static shuffle(arr) {
        var length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    }

    static parseJson2Array(str: string) {
        let arr = []
        arr = str.split('|').map((str) => { return +str })
        // arr = arr.map(item => {
        //     return item.split(',').map((string) => { return +string })
        // })

        return arr
    }

    // static noRepeat(arr: number[]) {
    //     var newArr = [...new Set(arr)]
    //     return newArr
    // }

    static getPointRangeVec2(point: cc.Vec2, range) {
        return cc.v2(point.x + Utils.getRandomNumber(range * 2) - range, point.y + Utils.getRandomNumber(range * 2) - range)
    }

    //根据等级获取境界 境界等级
    static getLevelData(lv: number) {

    }

    static getNodeUsePos(node: cc.Node) {
        let worldPos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)//世界坐标
        return GameUI.instance.view.content.convertToNodeSpaceAR(worldPos)
        //spNode.setPosition(spNode.parent.convertToNodeSpaceAR(worldPos))
    }
}