import { parse } from 'url';

import { fetchTrendingRepositories } from '../github';

jest.setTimeout(10000);

test('Fetch trending repositories', async () => {
  for (const language of [undefined, 'c', 'javascript']) {
    const repositories = await fetchTrendingRepositories(language);

    for (const { language, name, url } of repositories) {
      expect(typeof language).toBe('string');
      expect(typeof name).toBe('string');

      const { hostname, protocol } = parse(url);

      expect(hostname).toBe('github.com');
      expect(protocol).toBe('https:');
    }
  }
});
