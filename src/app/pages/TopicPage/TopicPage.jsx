import React, { useContext } from 'react';
import ATIAnalytics from '#containers/ATIAnalytics';
import { shape, arrayOf, string } from 'prop-types';
import styled from '@emotion/styled';
import {
  GEL_SPACING,
  GEL_SPACING_DBL,
  GEL_SPACING_TRPL,
  GEL_SPACING_QUAD,
  GEL_SPACING_QUIN,
  GEL_SPACING_SEXT,
} from '#psammead/gel-foundations/src/spacings';
import {
  GEL_GROUP_2_SCREEN_WIDTH_MIN,
  GEL_GROUP_3_SCREEN_WIDTH_MIN,
  GEL_GROUP_4_SCREEN_WIDTH_MIN,
} from '#psammead/gel-foundations/src/breakpoints';
import MetadataContainer from '#containers/Metadata';
import LinkedData from '#containers/LinkedData';
import AdContainer from '#containers/Ad';
import CanonicalAdBootstrapJs from '#containers/Ad/Canonical/CanonicalAdBootstrapJs';
import useToggle from '#hooks/useToggle';
import { ServiceContext } from '#contexts/ServiceContext';
import { RequestContext } from '#contexts/RequestContext';
import ChartbeatAnalytics from '#containers/ChartbeatAnalytics';
import isLive from '#lib/utilities/isLive';
import TopicImage from './TopicImage';
import TopicTitle from './TopicTitle';
import TopicDescription from './TopicDescription';
import Pagination from './Pagination';
import Curation, { VISUAL_PROMINANCE, VISUAL_STYLE } from './Curation';

const Wrapper = styled.main`
  max-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN};
  margin: 0 auto;
  padding: 0 ${GEL_SPACING};
  @media (min-width: ${GEL_GROUP_2_SCREEN_WIDTH_MIN}) {
    padding: 0 ${GEL_SPACING_DBL};
  }
`;

const InlineWrapper = styled.div`
  @media (min-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN}) {
    align-items: center;
    display: flex;
  }
`;

const TitleWrapper = styled.div`
  margin: ${GEL_SPACING_TRPL} 0;
  @media (min-width: ${GEL_GROUP_2_SCREEN_WIDTH_MIN}) {
    margin: ${GEL_SPACING_QUAD} 0;
  }
  @media (min-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    margin: ${GEL_SPACING_SEXT} 0;
  }

  @media (min-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN}) {
    margin: ${GEL_SPACING_QUIN} 0 ${GEL_SPACING_SEXT} 0;
  }
`;

const TopicPage = ({ pageData }) => {
  const { lang, translations } = useContext(ServiceContext);
  const { title, description, imageData, promos, pageCount, activePage } =
    pageData;

  const { enabled: adsEnabled } = useToggle('ads');
  const { showAdsBasedOnLocation } = useContext(RequestContext);

  const promoEntities = promos.map(promo => ({
    '@type': 'Article',
    name: promo.title,
    headline: promo.title,
    url: promo.link,
    dateCreated: promo.firstPublished,
  }));

  const { pageXOfY, previousPage, nextPage, page } = {
    pageXOfY: 'Page {x} of {y}',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    page: 'Page',
    ...translations.pagination,
  };

  const translatedPage = pageXOfY
    .replace('{x}', activePage)
    .replace('{y}', pageCount);

  const pageTitle = `${title}, ${translatedPage}`;

  return (
    <>
      {adsEnabled && showAdsBasedOnLocation && (
        <>
          <CanonicalAdBootstrapJs />
          <AdContainer slotType="leaderboard" />
        </>
      )}
      <Wrapper role="main">
        <ATIAnalytics data={pageData} />
        <ChartbeatAnalytics data={pageData} />
        <MetadataContainer
          title={activePage >= 2 ? pageTitle : title}
          socialHeadline={title}
          lang={lang}
          description={description}
          openGraphType="website"
          hasAmpPage={false}
        />
        <LinkedData
          type="CollectionPage"
          seoTitle={title}
          headline={title}
          entities={promoEntities}
        />
        <TitleWrapper>
          <InlineWrapper>
            {!isLive() && imageData && <TopicImage image={imageData.url} />}
            <TopicTitle>{title}</TopicTitle>
          </InlineWrapper>
          {!isLive() && description && (
            <TopicDescription>{description}</TopicDescription>
          )}
        </TitleWrapper>
        <Curation
          visualStyle={VISUAL_STYLE.NONE}
          visualProminance={VISUAL_PROMINANCE.NORMAL}
          promos={promos}
        />
        <Pagination
          activePage={activePage}
          pageCount={pageCount}
          pageXOfY={pageXOfY}
          previousPage={previousPage}
          nextPage={nextPage}
          page={page}
        />
      </Wrapper>
    </>
  );
};

TopicPage.propTypes = {
  pageData: shape({
    title: string.isRequired,
    promos: arrayOf(shape({})).isRequired,
  }).isRequired,
};

export default TopicPage;
