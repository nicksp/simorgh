import React, { useContext } from 'react';
import { oneOf, string, elementType, bool } from 'prop-types';
import { RequestContext } from '#contexts/RequestContext';
import { ServiceContext } from '#contexts/ServiceContext';
import useToggle from '#hooks/useToggle';
import { getMostReadEndpoint } from '#lib/utilities/getUrlHelpers/getMostReadUrls';
import isLive from '#app/lib/utilities/isLive';
import Canonical from './Canonical';
import mostReadShape from './utilities/mostReadShape';
import AmpMostRead from './Amp';

const blockLevelEventTrackingData = {
  componentName: 'most-read',
};

const showMostReadPageTypes = ['STY', 'article'];

const MostReadContainer = ({
  mostReadEndpointOverride,
  initialData,
  columnLayout,
  size,
  wrapper,
  serverRenderOnAmp,
}) => {
  const { variant, isAmp, pageType } = useContext(RequestContext);
  const {
    service,
    mostRead: { hasMostRead },
  } = useContext(ServiceContext);

  const { enabled } = useToggle('mostRead');

  const environment = process.env.SIMORGH_BASE_URL;
  const mostReadToggleEnabled = enabled && hasMostRead;
  const endpoint =
    mostReadEndpointOverride || getMostReadEndpoint({ service, variant });
  const mostReadUrl = `${environment}${endpoint}`;

  // Do not render most read when a toggle is disabled
  if (!mostReadToggleEnabled) {
    return null;
  }
  // Do not render on AMP when it is on the frontPage
  // We render amp on STY and ART using amp-script
  // We only want to render most read on AMP for the "/popular/read" pages
  if (
    isAmp &&
    !serverRenderOnAmp &&
    showMostReadPageTypes.includes(pageType) &&
    !isLive()
  ) {
    return <AmpMostRead endpoint={mostReadUrl} size={size} wrapper={wrapper} />;
  }

  if (isAmp && !serverRenderOnAmp) {
    return null;
  }

  return (
    <Canonical
      initialData={initialData}
      endpoint={endpoint}
      wrapper={wrapper}
      columnLayout={columnLayout}
      size={size}
      eventTrackingData={blockLevelEventTrackingData}
    />
  );
};

MostReadContainer.propTypes = {
  mostReadEndpointOverride: string,
  columnLayout: oneOf(['oneColumn', 'twoColumn', 'multiColumn']),
  size: oneOf(['default', 'small']),
  initialData: mostReadShape,
  wrapper: elementType,
  serverRenderOnAmp: bool,
};

MostReadContainer.defaultProps = {
  mostReadEndpointOverride: undefined,
  columnLayout: 'multiColumn',
  size: 'default',
  initialData: undefined,
  wrapper: undefined,
  serverRenderOnAmp: false,
};

export default MostReadContainer;
