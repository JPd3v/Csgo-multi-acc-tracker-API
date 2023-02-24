import puppeteer from 'puppeteer';
import type { ItemsInfo } from '../types';

export default async function casesScrapper() {
  try {
    const browser = await puppeteer.launch({
      args: ['--lang=en-EN,en'],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en',
    });

    await page.goto(
      'https://steamcommunity.com/market/search?q=case&category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&category_730_Rarity%5B%5D=tag_Rarity_Common&appid=730#p1_price_asc',
      { waitUntil: 'networkidle2' },
    );

    const scrapedItems: Partial<ItemsInfo[]> = [];

    let isBtnDisabled = true;
    while (isBtnDisabled) {
      await page.waitForNetworkIdle();

      const marketitems = await page.$$('.market_listing_row_link');

      marketitems.map(async (item, index) => {
        const itemSteamURL = await page.$eval(
          `#resultlink_${index}`,
          (element) => element.getAttribute('href'),
        );

        const itemPrice = await page.evaluate(
          (el) =>
            el.querySelector('span.normal_price > span.normal_price')
              .textContent,
          item,
        );
        const formatedPrice = Number(itemPrice.split(' ')[0].replace('$', ''));

        const itemName = await page.evaluate(
          (el) => el.querySelector('span.market_listing_item_name').textContent,
          item,
        );
        scrapedItems.push({
          item_name: itemName,
          collection_name: 'cases',
          item_data: [
            {
              steam_url: itemSteamURL,
              price: formatedPrice,
            },
          ],
        });
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

    const fileteredItems = scrapedItems.filter(
      (element) => !element.item_name.includes('Key'),
    );

    return fileteredItems;
  } catch (error) {
    console.log('something went wrong scrapping cases information', error);
  }
}
