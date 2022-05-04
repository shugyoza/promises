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

        if (value instanceof KylePromise) {
            value.then(this.#onSuccessBind, this.#onFailBind);
            return;
        }

        this.#value = value;
        this.#state = STATE.FULFILLED;
        this.#runCallbacks();

    }

    // must be private, so no one can access it, add #
    #onFail(value) {
        // qmicrotask to put all this logic on the queue to wait until stack call cleared
        // just a few seconds. we can use setTimeout to do this
        queueMicrotask(() => {
            // we cannot resolve/reject multiple times, just once!
            if (this.#state !== STATE.PENDING) return;

            if (value instanceof KylePromise) {
                value.then(this.#onSuccessBind, thi.#onFailBind);
                return;
            }

            if (this.#catchCbs.length === 0) {
                throw new UncaughtPromiseError(value)
            }

            this.#value = value;
            this.#state = STATE.REJECTED;
            this.#runCallbacks();
        })

    }

    then(thenCb, catchCb) {
        // to be able for chaining .then
        return new MyPromise((resolve, reject) => {
            this.#thenCbs.push((result) => {
                // this if is running when the chaining meets a .catch
                // ...then().catch().then which does not care what happens on
                // success, to skip to the next then
                if (thenCb == null) {
                    resolve(result)
                    return;
                }

                try {
                    resolve(thenCb(result))
                } catch (err) {
                    // this catch so that on .then().catch().then();
                    // when err thrown on first .then, will get us to the .catch
                    reject(err)
                }
            })

            this.#catchCbs.push((result) => {
                if (catchCb == null) {
                    reject(result);
                    return;
                }

                try {
                    resolve(catchCb(result))
                } catch (err) {
                    reject(err)
                }
            })


            // if (thenCb != null) this.#thenCbs.push(cb);
            // if (cathCb != null) this.#catchCbs.push(cb);

            this.#runCallbacks()

        });
    }

    // works exactly like then method, but instead adding to catchCbs,
    // difference is then takes 2 cbs: thenCb and catchCb
    catch(cb) {
        this.then(undefined, cb)
    }

    // finally never gets any result value passed onto it.
    // e.g. p.then().finally().then()
    // we want the result to skip (not invoked) by finally (but) invoked to the next .then
    finally(cb) {
        return this.then((result) => {
            cb(); // don't pass the result into this cb.
            return result; // so that it got chained down with other promises
        }, (result) => { // e.g. p.then().finally().catch()
            cb()
            throw result
        });
    }

    static resolve(value) {
        return new Promise((resolve) => {
            resolve(value);
        })
    }

    static reject(value) {
        return new Promise((resolve, reject) => {
            reject(value)
        })
    }

    // e.g. Promise.all(promise1, promise2, promise3).then([val1, val2, val3]).catch((e =>))
    static all(promises) {
        const results = [];
        let completedPromises = 0;
        return new KylePromise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                const promise = promises[i];
                promise.then((value) => {
                    completedPromises++;
                    results[i] = value;
                    if (completedPromises === promises.length) {
                        resolve(value);
                    }
                }).catch(reject)
            }
        })
    }

    // it waits for all promises to settled, whether resolved or rejected
    // so that all promises returned statuses and either values or reasons of rejection
    static allSettled(promise) {
        const results = [];
        let completedPromises = 0;

        // allSettled NEVER rejects, because every Resolve AND Reject will be served in results anyway
        return new KylePromise((resolve/*, reject*/) => {
            for (let i = 0; i < promises.length; i++) {
                const promise = promises[i];
                promise
                .then((value) => {
                    results[i] = {status: STATE.FULFILLED, value}
                })
                .catch((reason) => {
                    results[i] = {status: STATE.REJECTED, reason}
                })
                .finally(() => {
                    completedPromises++
                    if (completedPromises === promises.length) {
                        resolve(results);
                    }
                })
            }
        })
    }

    // serves the first promise that returns, regardless or result, either succeed or fail
    static race(promises) {
        return new KylePromise((resolve, reject) => {
            promises.forEach((promise) => {
                promise.then(resolve).catch(reject)
            })
        })
    }

    // serves the first promise that resolves, UNLESS every promise returns FAIL
    static any(promises) {
        const errs = [];
        let rejectedPromises = 0;
        return new KylePromise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                let promise = promises[i];
                promise
                .then(resolve)
                .catch((reason) => {
                    rejectedPromises++;
                    errs[i] = reason;
                    if (rejectedPromises === promises.length) {
                        reject(new AggregateError(errors, "All promises were rejected"))
                    }
                })
            }
        })
    }
}

class UncaughtPromiseError extends Error {
    constructor(error) {
        super(error)

        this.stack = `(in promise) ${error.stack}`
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
