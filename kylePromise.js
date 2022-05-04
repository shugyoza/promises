class KylePromise {
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
*/
