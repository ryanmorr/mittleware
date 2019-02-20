class Middleware {
    constructor(callback = (data, next) => next(data)) {
        this.callback = callback;
        this.middleware = [];
    }

    use(callback) {
        this.middleware.push(callback);
    }

    run(data) {
        return new Promise((resolve, reject) => {
            let resolved = false;
            const error = (obj) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                reject(obj);
            };
            const done = (obj) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                resolve(obj);
            };
            const middleware = this.middleware;
            if (middleware[0]) {
                let i = 0;
                const next = () => {
                    if (!resolved) {
                        const mw = middleware[++i];
                        if (mw) {
                            mw(data, next, error);
                        } else {
                            this.callback(data, done, error);
                        }
                    }
                };
                middleware[i](data, next, error);
            } else {
                this.callback(data, done, error);
            }
        });
    }
}

export default function middleware(callback) {
    return new Middleware(callback);
}
