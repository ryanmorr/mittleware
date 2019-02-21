export default function middleware(callback = (data, next) => next(data)) {
    const middleware = [];

    return {
        use(callback) {
            middleware.push(callback);
        },

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
                if (middleware[0]) {
                    let i = 0;
                    const next = () => {
                        if (!resolved) {
                            const mw = middleware[++i];
                            if (mw) {
                                mw(data, next, error);
                            } else {
                                callback(data, done, error);
                            }
                        }
                    };
                    middleware[i](data, next, error);
                } else {
                    callback(data, done, error);
                }
            });
        }
    };
}
