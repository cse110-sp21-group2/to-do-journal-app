import { assert } from 'chai'
import { app } from '../example.js';

describe('App', function() {
    it('App should return hello', function() {
        assert.equal(app(), 'hello');
    })
})