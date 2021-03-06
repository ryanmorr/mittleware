export default function mittleware() {
    const middleware = [];

    return {
        use(callback) {
            middleware.push(callback);
            return this;
        },

        dispatch(data) {
            return new Promise((resolve, reject) => {
                if (middleware[0]) {
                    let i = 0;
                    const next = () => {
                        const mw = middleware[++i];
                        if (mw) {
                            mw(data, next, resolve, reject);
                        } else {
                            resolve(data);
                        }
                    };
                    middleware[i](data, next, resolve, reject);
                } else {
                    resolve(data);
                }
            });
        }
    };
}
