import puppeteer from 'puppeteer';
import type { ItemsInfo } from '../types';

export default async function scrapeCollection(
  collectionTag: string,
  collectionName: string,
) {
  try {
    const browser = await puppeteer.launch({
      args: ['--lang=en-EN,en'],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en',
    });

    await page.goto(
      `https://steamcommunity.com/market/search?q=&category_730_ItemSet%5B%5D=${collectionTag}&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&category_730_Exterior%5B%5D=tag_WearCategory2&category_730_Exterior%5B%5D=tag_WearCategory1&category_730_Exterior%5B%5D=tag_WearCategory4&category_730_Exterior%5B%5D=tag_WearCategory3&category_730_Exterior%5B%5D=tag_WearCategory0&category_730_Quality%5B%5D=tag_normal&appid=730#p1_name_asc`,
      { waitUntil: 'networkidle2' },
    );

    const scrapedItems: ItemsInfo[] = [];

    let isBtnDisabled = true;
    while (isBtnDisabled) {
      await page.waitForNetworkIdle();

      const marketitems = await page.$$('.market_listing_row_link');

      marketitems.map(async (item) => {
        const itemPrice = await page.evaluate(
          (el) =>
            el.querySelector('span.normal_price > span.normal_price')
              .textContent,
          item,
        );
        const formatedPrice = Number(itemPrice.split(' ')[0].replace('$', ''));

        const itemTextContent = await page.evaluate(
          (el) =>
            el
              .querySelector('span.market_listing_item_name')
              .textContent.split(' ('),
          item,
        );

        const itemName = itemTextContent[0];
        const itemQuality = itemTextContent[1].replace(')', '');
        const lastItemAdded = scrapedItems.length - 1;

        if (!scrapedItems[lastItemAdded]?.item_name.includes(itemName)) {
          scrapedItems.push({
            item_name: itemName,
            collection_name: collectionName,
            item_data: [
              {
                quality: itemQuality,
                price: formatedPrice,
              },
            ],
          });
        }
        if (scrapedItems[lastItemAdded]?.item_name.includes(itemName)) {
          scrapedItems[lastItemAdded].item_data.push({
            quality: itemQuality,
            price: formatedPrice,
          });
        }
      });

      await page.waitForSelector('#searchResults_btn_next', { visible: true });
      const asNextPage = await page.$eval(
        '#searchResults_btn_next',
        (el) => !el.className.includes('disabled'),
      );

      isBtnDisabled = asNextPage;
      if (asNextPage) {
        await page.click('#searchResults_btn_next');
        await page.waitForNetworkIdle();
      }
    }

    browser.close();
    return scrapedItems;
  } catch (error) {
    console.log(error);
  }
}
