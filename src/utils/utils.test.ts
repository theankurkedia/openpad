import { getEncodedContent } from '.';
import { EditorState, ContentState } from 'draft-js';

describe('getEncodedContent', () => {
  test('Is valid string', () => {
    expect(
      getEncodedContent(
        EditorState.createWithContent(
          ContentState.createFromText('Test')
        ).getCurrentContent()
      )
    ).toEqual(
      expect.stringContaining('text%22%3A%22Test%22%2C%22type%22%3A%22unstyled')
    );
  });
});
