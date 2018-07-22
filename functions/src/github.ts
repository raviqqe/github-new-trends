import axios from 'axios';
import cheerio = require('cheerio');
import * as url from 'url';

export interface ILanguage {
  color: string;
  id: string;
  name: string;
}

export interface IRepository {
  date: number;
  description?: string;
  id: string;
  language?: ILanguage;
  name: string;
  stars: number;
  url: string;
}

function languageNameToID(name: string): string {
  return name.toLowerCase().replace(' ', '-');
}

async function fetchTrendingPage(languageID: string) {
  return cheerio.load(
    (await axios.get(
      `https://github.com/trending/${encodeURIComponent(languageID)}`
    )).data
  );
}

function getLanguage(parentElement): ILanguage | null {
  const element = parentElement
    .find('[itemprop="programmingLanguage"]')
    .first();

  if (!element.text().trim()) {
    return null;
  }

  const name = element.text().trim();

  return {
    color: element.prev().css('background-color'),
    id: languageNameToID(name),
    name
  };
}

export async function fetchTrendingRepositories(
  languageID?: string
): Promise<IRepository[]> {
  if (!languageID) {
    languageID = '';
  }

  const $ = await fetchTrendingPage(languageID);
  const repositories: IRepository[] = [];
  const date = new Date().getTime();

  for (const element of $('ol.repo-list li').toArray()) {
    const title = $(element).find('h3');
    const path = title.find('a').prop('href');

    repositories.push({
      date,
      description: $(element)
        .find('p')
        .text()
        .trim(),
      id: (languageID || 'all') + path,
      language: getLanguage($(element)),
      name: title.text().trim(),
      stars: Number(
        $(element)
          .find('[aria-label="star"]')
          .parent()
          .text()
          .replace(',', '')
      ),
      url: url.resolve('https://github.com', path)
    });
  }

  return repositories;
}

export async function fetchLanguage(languageID: string): Promise<ILanguage> {
  const $ = await fetchTrendingPage(languageID);

  return getLanguage($('body'));
}
