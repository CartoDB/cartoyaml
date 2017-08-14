/* globals describe, it, xit */
import Utils from '../utils/utils';
import chai from 'chai';
let expect = chai.expect;

import { getCollide } from '../../src/basic/points';


describe('Points', () => {
  describe('.getCollide', () => {
    xit('Should return false when marker-allow-overlap is not defined', () => {
      const c3ss = Utils.getShader('#layer {  marker-line-color: #FFF; }');
      expect(getCollide(c3ss)).to.equal(false);
    });
    it('Should return false when marker-allow-overlap is true', () => {
      const c3ss = Utils.getShader('#layer { marker-allow-overlap: true; }');
      expect(getCollide(c3ss)).to.equal(true);
    });
    it('Should return false when marker-allow-overlap is false', () => {
      const c3ss = Utils.getShader('#layer { marker-allow-overlap: false; }');
      expect(getCollide(c3ss)).to.equal(false);
    });
    // Should this cases thow an error? dynamic values for marker-allow-overlap are not supported by tangram!
    xit('TBD', () => {
      const c3ss = Utils.getShader('#layer [zoom <= 5] {marker-allow-overlap: true;}');
      expect(getCollide(c3ss)).to.equal(false);
    });
    xit('TBD', () => {
      const c3ss = Utils.getShader('#layer [zoom <= 5] {marker-allow-overlap: false; }');
      expect(getCollide(c3ss)).to.equal(false);
    });
    xit('TBD', () => {
      const c3ss = Utils.getShader(`
      #layer {
        marker-allow-overlap: true;
        [zoom <= 5] {
          marker-allow-overlap: false;
          marker-width: 5px;
        }
        [zoom <= 10] {
          marker-allow-overlap: true;
          marker-width: 10px;
        }
      }`);
      expect(getCollide(c3ss)).to.equal(false);
    });
  });
});
