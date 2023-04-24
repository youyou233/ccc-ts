export default class GameManager {
    static _instance: GameManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new GameManager()
        }
        return this._instance
    }
}