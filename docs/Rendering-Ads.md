# Rendering Ad

We are currently rendering two types of Ads on our front pages.

Leaderboard Ad
![Leaderboard Ad
](https://user-images.githubusercontent.com/30599794/90142128-eb7c7080-dd73-11ea-8c68-f47b27f56620.png)

MPU Ad
![MPU Ad](https://user-images.githubusercontent.com/30599794/90142048-cee03880-dd73-11ea-92f7-1f1c9098d228.png)

## Services with Ads enabled

Afrique, Arabic, Hindi, Mundo, Portuguese, Russian, Zhongwen

## Rendering Ads on local environment

Given you are using Chrome browser.

1. Download [ModHeader Chrome extension](https://www.google.com/search?q=modheader+chrome+pass+boolean&rlz=1C5CHFA_enGB762GB762&oq=modheader&aqs=chrome.0.69i59l2j69i57j69i60j69i61j69i60j69i65l2.1039j0j7&sourceid=chrome&ie=UTF-8)

2. With the ModHeader extension, add a header of `BBC-Adverts` with the value `true`.

   e.g. ![image](https://user-images.githubusercontent.com/30599794/90151074-40bd7f80-dd7e-11ea-985d-902ed04641ac.png)

3. Download the [CORS Unblock Chrome extension](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en) to prevent any CORS errors related to https://www.test.bbc.com/userinfo which would prevent the ads to display correctly.

4. Run local environment: `yarn dev`. If you would like to run with Simorgh's CSP Headers, run the following command: `yarn build && yarn start`

5. Visit the home page of one of the services with Ads enabled and append this query string to the url: `?site=test&ads-debug=true`

   e.g. http://localhost:7080/mundo?site=test&ads-debug=true

## Rendering Ads on test environment

Given you do not have any ad blocking extensions in your browser.

1. Use a proxy to set your location outside the UK. Visiting https://www.test.bbc.com/userinfo should show `"X-Ip_is_advertise_combined": "yes"`. And when you visit https://www.test.bbc.com/mundo you should be able to see an advert.

2. If you would like to see the ads with the debugger tool you can append this query string to the url: `?ads-debug=true`

   e.g. https://www.test.bbc.com/mundo?ads-debug=true

## Rendering Ads on an a11y device

If you are unable to set a proxy on one of the Windows a11y laptops, you won't be able to see ads within the UK. For this reason, you'll have to run Simorgh locally on your working machine and allow the Windows laptop to connect to it over LAN with the following steps:

1. Connect both devices to the same network

2. Update the `SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN` url in the [local.env](https://github.com/bbc/simorgh/blob/latest/envConfig/local.env#L3) file with the IP address of your machine

   e.g. `SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN=http://192.168.0.50:7080`

3. Disable the `upgrade-insecure-requests` directive from the [cspHeader](https://github.com/bbc/simorgh/blob/latest/src/server/utilities/cspHeader/index.js#L419)

4. If you can't set the `BBC-Adverts` header in the Windows laptop, you will need to remove [this](https://github.com/bbc/simorgh/blob/latest/src/app/containers/Ad/Canonical/index.jsx#L63) condition from the codebase to be able to render the ad

5. Run Simorgh with a production build `yarn build && yarn start`

6. Connect to your machine running Simorgh using the Windows laptop by visiting the IP address of it appended with the correct query strings

   e.g. `http://192.168.0.50:7080/mundo?site=test&ads-debug=true`

## Additional Query Strings

You can append this query string `?ads-js-env=live` to your URL to load the LIVE `dotcom-bootstrap` for canonical pages only.

e.g. https://www.test.bbc.com/mundo?ads-js-env=live

## Known Issues

We know the existence of a minor intermittent issue in the local environment which prevents the correct rendering of the leaderboard ad. Reloading the page a couple of times with cache disabled, should allow you to see the leaderboard ad.

Another minor intermittent issue in the local environment occurs when trying to render ads at different breakpoints. In this case, reloading the page might not be enough, and you should try rendering the ad using another page data.
