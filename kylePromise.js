class KylePromise {
    #thenCbs = [];

    constructor(cb) {
        try {
            cb(this.onSuccess, this.onFail)
        } catch (err) {
            this.onFail(err)
        }
    }

    // must be private, so no one can access it, add #
    #onSuccess(value) {

    }

    // must be private, so no one can access it, add #
    #onFail(value) {

    }

    then(cb) {
        this.#thenCbs.push(cb)
    }

}

module.exports = KylePromise;

/*
when highlighted, only .then, .catch, .finally options popped out in IDE,
that means all other method must be private

const p = new Promise(cb)
p.then(() => {

}).catch(() => {

})

const p1 = new Promise(cb).then()
p.then()
p.then()
// so we need to save cb in then method in an array
*/
