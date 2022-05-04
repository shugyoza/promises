const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}
class KylePromise {
    #thenCbs = [];
    #catchCbs = [];
    #state = STATE.PENDING
    #value
    // we need this binding for chaining process
    #onSuccessBind = this.#onSuccess.bind(this)
    #onFailBind = this.#onFail.bind(this)

    constructor(cb) {
        try {
            // won't work without binding on chaining
            // cb(this.onSuccess, this.onFail)

            // bound onSuccess/onFail to make sure the this ran in onSuccess/onFail properly
            cb(this.#onSuccessBind, this.#onFailBind)
        } catch (err) {
            this.onFail(err)
        }
    }

    #runCallbacks() {
        // if state is success
        if (this.#state === STATE.FULFILLED) {
            // iterate through all the callbacks in the array of then callbacks
            this.#thenCbs.forEach((callback) => {
                // and invoke each callback with the given success value
                callback(this.#value);
            });
            // reset the thenCbs after invoking all of them, for the next run
            this.#thenCbs = [];
        }
        // if state is fail
        else if (this.#state === STATE.REJECTED) {
            // iterate through all the callbacks in the array of catch callbacks
            this.#catchCbs.forEach((callback) => {
                // and invoke each callback with the given error value
            });
            // reset the catchCbs after invoking all of them, for the next run
            this.#catchCbs = [];

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

    then(thenCb, catchCb) {
        if (thenCb != null) this.#thenCbs.push(cb);
        if (cathCb != null) this.#catchCbs.push(cb);

        this.#runCallbacks()

        // to be able for chaining .then
        return new Promise();
    }

    // works exactly like then method, but instead adding to catchCbs,
    // difference is then takes 2 cbs: thenCb and catchCb
    catch(cb) {
        this.then(undefined, cb)
    }

    finally(cb) {

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

// chaining
p.then().then().then()
*/
