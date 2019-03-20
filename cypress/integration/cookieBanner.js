import {
  assertCookieValue,
  assertCookieExpiryDate,
} from '../support/metaTestHelper';
import config from '../support/config';

const getPrivacyBanner = () =>
  cy.contains("We've updated our Privacy and Cookies Policy");
const getCookieBanner = () => cy.contains('Let us know you agree to cookies');
const getPrivacyBannerContainer = () => getPrivacyBanner().parent();
const getCookieBannerContainer = () => getCookieBanner().parent();

const ensureCookieExpiryDates = () => {
  const inOneYear = (new Date() / 1000 + 60 * 60 * 24 * 365).toFixed();
  assertCookieExpiryDate('ckns_explicit', inOneYear);
  assertCookieExpiryDate('ckns_policy', inOneYear);
  assertCookieExpiryDate('ckns_privacy', inOneYear);
};

const assertCookieValues = cookies => {
  Object.keys(cookies).forEach(cookie => {
    assertCookieValue(cookie, cookies[cookie]);
  });
};

describe('Article Body Tests', () => {
  // eslint-disable-next-line no-undef
  beforeEach(() => {
    cy.visit(`/news/articles/${config.assets.newsThreeSubheadlines}`);
  });

  it('should have a privacy & cookie banner, which disappears once "accepted" ', () => {
    getPrivacyBanner().should('be.visible');
    getCookieBanner().should('not.be.visible');

    assertCookieValues({
      ckns_privacy: '1',
      ckns_policy: '000',
    });

    getPrivacyBannerContainer()
      .contains('OK')
      .click();

    getCookieBanner().should('be.visible');
    getPrivacyBanner().should('not.be.visible');

    getCookieBannerContainer()
      .contains('Yes, I agree')
      .click();

    assertCookieValues({
      ckns_explicit: '1',
      ckns_privacy: '1',
      ckns_policy: '111',
    });

    getCookieBanner().should('not.be.visible');
    getPrivacyBanner().should('not.be.visible');

    ensureCookieExpiryDates();
  });

  it('should have a privacy banner that disappears once accepted but a cookie banner that is rejected', () => {
    getPrivacyBanner().should('be.visible');
    getCookieBanner().should('not.be.visible');

    assertCookieValues({
      ckns_privacy: '1',
      ckns_policy: '000',
    });

    getPrivacyBannerContainer()
      .contains('OK')
      .click();
    getCookieBannerContainer()
      .contains('No, take me to settings')
      .click();

    cy.visit(`/news/articles/${config.assets.newsThreeSubheadlines}`);

    assertCookieValues({
      ckns_explicit: '1',
      ckns_privacy: '1',
      ckns_policy: '000',
    });

    getCookieBanner().should('not.be.visible');
    getPrivacyBanner().should('not.be.visible');

    ensureCookieExpiryDates();
  });

  it("should show cookie banner (and NOT privacy banner) if user has visited the page before and didn't explicitly 'accept' cookies", () => {
    cy.clearCookies();
    cy.setCookie('ckns_privacy', '1');
    cy.visit(`/news/articles/${config.assets.newsThreeSubheadlines}`);

    getPrivacyBanner().should('not.be.visible');
    getCookieBanner().should('be.visible');
  });

  it("should not override the user's default cookie policy", () => {
    cy.clearCookies();
    cy.setCookie('ckns_policy', 'made_up_value');
    cy.visit(`/news/articles/${config.assets.newsThreeSubheadlines}`);
    assertCookieValues({
      ckns_policy: 'made_up_value',
    });
  });
});
