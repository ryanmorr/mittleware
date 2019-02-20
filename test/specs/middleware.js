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
            expect(data).to.equal('bar');
            done();
        });
    });
});
