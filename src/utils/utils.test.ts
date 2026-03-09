import { getDecodedContent } from '.';

describe('getDecodedContent', () => {
  test('decodes URL-encoded markdown', () => {
    const encoded = encodeURIComponent('Hello **world**');
    expect(getDecodedContent(encoded)).toBe('Hello **world**');
  });
});
