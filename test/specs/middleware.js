import sinon from 'sinon';
import { expect } from 'chai';
import middleware from '../../src/middleware';

describe('middleware', () => {
    it('should invoke the callback, pass the data, and resolve the promise when run', (done) => {
        const callback = sinon.spy((data, resolve, reject) => {
            expect(data).to.equal('foo');
            expect(reject).to.be.a('function');
            expect(resolve).to.be.a('function');
            resolve('bar');
        });

        const mw = middleware(callback);
        const promise = mw.run('foo');

        expect(promise).to.be.a('promise');
        promise.then((data) => {
            expect(callback.called).to.equal(true);
            expect(data).to.equal('bar');
            done();
        });
    });

    it('should invoke the callback and reject the promise when run', (done) => {
        const error = new Error();
        const callback = sinon.spy((data, resolve, reject) => reject(error));

        const mw = middleware(callback);
        mw.run('foo').catch((e) => {
            expect(callback.called).to.equal(true);
            expect(e).to.equal(error);
            done();
        });
    });

    it('should support a default callback that will resolve the promise and pass the data', (done) => {
        const mw = middleware();
        mw.run('foo').then((data) => {
            expect(data).to.equal('foo');
            done();
        });
    });

    it('should add and call middleware', (done) => {
        const mw = middleware();

        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next) => next(data));

        mw.use(middleware1);
        mw.use(middleware2);

        mw.run('foo').then((data) => {
            expect(data).to.equal('foo');
            expect(middleware1.called).to.equal(true);
            expect(middleware2.called).to.equal(true);
            done();
        });
    });

    it('should call middleware in proper sequence', (done) => {
        const callback = sinon.spy((data, resolve) => resolve(data));
        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next) => next(data));

        const mw = middleware(callback);
        mw.use(middleware1);
        mw.use(middleware2);

        mw.run('foo').then(() => {
            expect(middleware1.calledBefore(middleware2)).to.equal(true);
            expect(middleware2.calledBefore(callback)).to.equal(true);
            expect(callback.called).to.equal(true);
            done();
        });
    });

    it('should require middleware to pass the data to the next one', (done) => {
        const obj = {foo: 1};

        const mw = middleware();

        const middleware1 = sinon.spy((data, next) => {
            expect(data).to.equal(obj);
            expect(data.foo).to.equal(1);
            data.foo += 1;
            next(data);
        });
        const middleware2 = sinon.spy((data, next) => {
            expect(data).to.equal(obj);
            expect(data.foo).to.equal(2);
            data.foo += 1;
            next(data);
        });
        const middleware3 = sinon.spy((data, next) => {
            expect(data).to.equal(obj);
            expect(data.foo).to.equal(3);
            data.foo += 1;
            next(data);
        });

        mw.use(middleware1);
        mw.use(middleware2);
        mw.use(middleware3);

        mw.run(obj).then((data) => {
            expect(data).to.equal(obj);
            expect(data.foo).to.equal(4);
            done();
        });
    });

    it('should break the chain if a middleware callback does not invoke the `next` function', () => {
        const callback = sinon.spy((data, resolve) => resolve(data));
        const middleware1 = sinon.spy(() => {});
        const middleware2 = sinon.spy((data, next) => next(data));

        const mw = middleware(callback);
        mw.use(middleware1);
        mw.use(middleware2);

        mw.run('foo');
        expect(middleware1.called).to.equal(true);
        expect(middleware2.called).to.equal(false);
        expect(callback.called).to.equal(false);
    });

    it('should break the chain if a middleware callback invokes the `error` function', (done) => {
        const error = new Error();
        const callback = sinon.spy((data, resolve) => resolve(data));
        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next, reject) => reject(error));
        const middleware3 = sinon.spy((data, next) => next(data));

        const mw = middleware(callback);
        mw.use(middleware1);
        mw.use(middleware2);
        mw.use(middleware3);

        const promise = mw.run('foo');
        expect(middleware1.called).to.equal(true);
        expect(middleware2.called).to.equal(true);
        expect(middleware3.called).to.equal(false);
        expect(callback.called).to.equal(false);
        promise.catch((e) => {
            expect(e).to.equal(error);
            done();
        });
    });

    it('should support async middleware', (done) => {
        const callback = sinon.spy((data, resolve) => resolve(data));
        const middleware1 = sinon.spy((data, next) => {
            setTimeout(() => next(data), 100);
        });

        const mw = middleware(callback);
        mw.use(middleware1);

        const promise = mw.run('foo');
        expect(middleware1.called).to.equal(true);
        expect(callback.called).to.equal(false);

        promise.then(() => {
            expect(callback.called).to.equal(true);
            done();
        });
    });
});
