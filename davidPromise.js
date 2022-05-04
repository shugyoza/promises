/*
console.log(1);
new Promise ((resolve, reject) => {
    console.log(2);
    resolve(3);
})

.then(num => {
    console.log(num);
    console.log(4)
});

console.log(5)
*/

class DavidPromise {
    #thenCbQ = [];
    #currentData = undefined;

    constructor(executor) {
        executor(this.resolve.bind(this), this.reject.bind(this));
    }

    // if we did this with arrow func, no need for bind
    resolve(resData) {
        // console.log('Hello resolve ', this);
        setTimeout(() => {
            this.#currentData = resData;
            while (this.#thenCbQ.length) {
                const cb = this.#thenCbQ.shift();
                this.#currentData = cb(resData);
            }
        }, 0);
    }

    reject() {
        console.log('Hello reject', this);
    }

    then(thenCbs) {
        this.#thenCbQ.push(thenCbs);

        return this;
    }

    catch() {

    }

}

console.log(1);
new DavidPromise ((resolve, reject) => {
    console.log(2);
    resolve(3);
    reject()
})

.then(data => {
    console.log(data);
    console.log(4)
});

console.log(5)
