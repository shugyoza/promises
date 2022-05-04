class KylePromise {
    constructor(cb) {
        try {
            cb(this.onSuccess, this.onFail)
        } catch (err) {
            this.onFail(err)
        }
    }

    onSuccess() {

    }

    onFail() {

    }

}

module.exports = KylePromise;
