import React from 'react';
import { shouldMatchSnapshot } from '@bbc/psammead-test-helpers';
import '@testing-library/jest-dom/extend-expect';
import CanonicalAd from './index';

describe('CanonicalAds Ads', () => {
  describe('Snapshots', () => {
    shouldMatchSnapshot(
      'should correctly render an Canonical leaderboard ad with dotcom-bootstrap script',
      <CanonicalAd service="pidgin" />,
    );
  });
});
