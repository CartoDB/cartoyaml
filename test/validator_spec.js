/* globals describe, it */
import Utils from './utils/utils.js';
import Validator from '../src/validator.js';
import chai from 'chai';
const expect = chai.expect;

describe('Validator', () => {
  describe('.validateCCSS', () => {
    it('Should throw an Error when valid ccss with incompatible rules is given', () => {
      let invalidCCSS = `
        #layer {
          marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/square-18.svg');
          marker-line-color: #FFF;
          marker-line-opacity: 1;
          marker-comp-op: overlay;
          marker-fill: #ccc;
        }`;
      expect(Utils.runFn(Validator.validateCSS, invalidCCSS)).to.throw();
    });
  });
});



