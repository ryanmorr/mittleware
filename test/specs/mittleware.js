import sinon from 'sinon';
import { expect } from 'chai';
import mittleware from '../../src/mittleware';

describe('mittleware', () => {
    it('should return a promise that is automatically resolved with the data if no middleware exists', (done) => {
        const mw = mittleware();
        const promise = mw.dispatch('foo');

        expect(promise).to.be.a('promise');
        promise.then((data) => {
            expect(data).to.equal('foo');
            done();
        });
    });

    it('should add and call middleware', (done) => {
        const mw = mittleware();

        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next) => next(data));

        mw.use(middleware1).use(middleware2);

        mw.dispatch('foo').then((data) => {
            expect(data).to.equal('foo');
            expect(middleware1.called).to.equal(true);
            expect(middleware2.called).to.equal(true);
            done();
        });
    });

    it('should call middleware in proper sequence', (done) => {
        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next) => next(data));
        const middleware3 = sinon.spy((data, next) => next(data));

        const mw = mittleware();
        mw.use(middleware1);
        mw.use(middleware2);
        mw.use(middleware3);

        mw.dispatch('foo').then(() => {
            expect(middleware1.calledBefore(middleware2)).to.equal(true);
            expect(middleware2.calledBefore(middleware3)).to.equal(true);
            expect(middleware3.called).to.equal(true);
            done();
        });
    });

    it('should require middleware to pass the data to the next one', (done) => {
        const obj = {foo: 1};

        const mw = mittleware();

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

        mw.dispatch(obj).then((data) => {
            expect(data).to.equal(obj);
            expect(data.foo).to.equal(4);
            done();
        });
    });

    it('should break the chain if a middleware does not call the next one', () => {
        const middleware1 = sinon.spy(() => {});
        const middleware2 = sinon.spy((data, next) => next(data));

        const mw = mittleware();
        mw.use(middleware1);
        mw.use(middleware2);

        mw.dispatch('foo');
        expect(middleware1.called).to.equal(true);
        expect(middleware2.called).to.equal(false);
    });

    it('should break the chain if a middleware rejects the promise', (done) => {
        const error = new Error();
        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next, resolve, reject) => reject(error));
        const middleware3 = sinon.spy((data, next) => next(data));

        const mw = mittleware();
        mw.use(middleware1);
        mw.use(middleware2);
        mw.use(middleware3);

        const promise = mw.dispatch('foo');
        expect(middleware1.called).to.equal(true);
        expect(middleware2.called).to.equal(true);
        expect(middleware3.called).to.equal(false);
        promise.catch((e) => {
            expect(e).to.equal(error);
            done();
        });
    });

    it('should break the chain if a middleware resolvesthe promise', (done) => {
        const middleware1 = sinon.spy((data, next) => next(data));
        const middleware2 = sinon.spy((data, next, resolve) => resolve(data));
        const middleware3 = sinon.spy((data, next) => next(data));

        const mw = mittleware();
        mw.use(middleware1);
        mw.use(middleware2);
        mw.use(middleware3);

        const promise = mw.dispatch('foo');
        expect(middleware1.called).to.equal(true);
        expect(middleware2.called).to.equal(true);
        expect(middleware3.called).to.equal(false);
        promise.then((data) => {
            expect(data).to.equal('foo');
            done();
        });
    });

    it('should support async middleware', (done) => {
        const middleware1 = sinon.spy((data, next) => {
            setTimeout(() => next(data), 100);
        });

        const mw = mittleware();
        mw.use(middleware1);

        mw.dispatch('foo').then((data) => {
            expect(data).to.equal('foo');
            expect(middleware1.called).to.equal(true);
            done();
        });
    });
});
