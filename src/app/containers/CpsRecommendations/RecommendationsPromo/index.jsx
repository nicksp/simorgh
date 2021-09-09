import React, { useContext } from 'react';
import pathOr from 'ramda/src/pathOr';
import styled from '@emotion/styled';
import { GEL_SPACING } from '@bbc/gel-foundations/spacings';
import { getSerifMedium } from '@bbc/psammead-styles/font-styles';
import { getPica } from '@bbc/gel-foundations/typography';
import { C_EBON, C_METAL } from '@bbc/psammead-styles/colours';
import { shape, string, oneOfType } from 'prop-types';
import { ServiceContext } from '#contexts/ServiceContext';
import RecommendationsImage from '../RecommendationsPromoImage';
import { storyItem } from '#models/propTypes/storyItem';
import useCombinedClickTrackerHandler from '../../StoryPromo/useCombinedClickTrackerHandler';

const StyledPromoWrapper = styled.div`
  padding: ${GEL_SPACING};
  margin-top: 8px;
  background-color: #f6f6f6;
`;

const PromoGridWrapper = styled.div`
  position: relative;
`;

const ImageWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 120px;
  vertical-align: top;
`;

const TextWrapper = styled.div`
  display: inline-block;
  width: calc(100% - 120px);
  padding: 0 16px;
  vertical-align: top;
`;

const Link = styled.a`
  position: static;
  color: ${C_EBON};
  text-decoration: none;
  overflow-wrap: break-word;

  &:before {
    bottom: 0;
    content: '';
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    white-space: nowrap;
    z-index: 1;
  }

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  &:visited {
    color: ${C_METAL};
  }
`;

const StyledHeadline = styled.h3`
  ${({ service }) => getSerifMedium(service)}
  ${({ script }) => getPica(script)}
  color: ${C_EBON};
  margin: 0;
  padding: ${GEL_SPACING} 0;
`;

const RecommendationsPromo = ({ promo, eventTrackingData }) => {
  const { script, service } = useContext(ServiceContext);
  const handleClickTracking = useCombinedClickTrackerHandler(eventTrackingData);
  const headline = pathOr(null, ['headlines', 'headline'], promo);
  const url = pathOr(null, ['locators', 'assetUri'], promo);
  const indexImage = pathOr(null, ['indexImage'], promo);

  return (
    <StyledPromoWrapper data-e2e="story-promo-wrapper">
      <PromoGridWrapper>
        <ImageWrapper>
          <RecommendationsImage indexImage={indexImage} />
        </ImageWrapper>
        <TextWrapper>
          <StyledHeadline script={script} service={service}>
            <Link
              href={url}
              onClick={eventTrackingData ? handleClickTracking : null}
            >
              {headline}
            </Link>
          </StyledHeadline>
        </TextWrapper>
      </PromoGridWrapper>
    </StyledPromoWrapper>
  );
};

RecommendationsPromo.propTypes = {
  promo: oneOfType([shape(storyItem)]).isRequired,
  eventTrackingData: shape({
    block: shape({
      componentName: string,
    }),
    link: shape({
      componentName: string,
      url: string,
      format: string,
    }),
  }),
};

RecommendationsPromo.defaultProps = {
  eventTrackingData: null,
};

export default RecommendationsPromo;
