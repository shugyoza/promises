const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}
class KylePromise {
    #thenCbs = [];
    #state = STATE.PENDING
    #value =

    constructor(cb) {
        try {
            cb(this.onSuccess, this.onFail)
        } catch (err) {
            this.onFail(err)
        }
    }

    #runCallbacks() {
        if (this.#state === STATE.FULFILLED) {

        }
        else if (this.#state === STATE.REJECTED) {

        }
    }

    // must be private, so no one can access it, add #
    #onSuccess(value) {
        // we cannot resolve/reject multiple times, just once!
        if (this.#state !== STATE.PENDING) return;

        this.#value = value;
        this.#state = STATE.FULFILLED;
        this.#runCallbacks();

    }

    // must be private, so no one can access it, add #
    #onFail(value) {
        // we cannot resolve/reject multiple times, just once!
        if (this.#state !== STATE.PENDING) return;

        this.#value = value;
        this.#state = STATE.REJECTED;
        this.#runCallbacks();
    }

    then(cb) {
        this.#thenCbs.push(cb)
    }

}

module.exports = KylePromise;

/*
when highlighted, only .then, .catch, .finally options popped out in IDE,
that means all other method must be private

const p = new Promise( (resolve, reject) => {
    // Code
    resolve('value for success')
    reject('value for error')
})
p.then(() => {

}).catch(() => {

})

const p1 = new Promise(cb).then()
p.then()
p.then()
// so we need to save cb in then method in an array
*/
