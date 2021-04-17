import { EditorState } from 'draft-js';
import TinyURL from 'tinyurl';

export function moveFocusToEnd(editorState: EditorState) {
  editorState = EditorState.moveFocusToEnd(editorState);
  return EditorState.forceSelection(editorState, editorState.getSelection());
}

async function getShortenedUrl(url: string): Promise<string> {
  return new Promise((resolve: any, reject: any) => {
    TinyURL.shorten(url).then(
      function (res: any) {
        resolve(res);
      },
      function (err: any) {
        console.log(err);
        reject(err);
      }
    );
  });
}

async function copyToClipboard(value: string, navigator: any) {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(value).then(
      () => {
        console.log('Url copied successfully');
        resolve(value);
      },
      (error: any) => {
        console.log('Error in copying url');
        reject(value);
      }
    );
  });
}

export function shortenAndCopyUrl(
  value: string,
  navigator: any,
  resolve: any,
  reject: any
) {
  getShortenedUrl(value)
    .then((resp: string) => {
      // If shorten success, trying to copy it to clipboard
      copyToClipboard(resp, navigator)
        .then((copyResp: any) => {
          resolve(copyResp);
        })
        .catch((error) => {
          // If error in copying shortened url, trying to copy original value
          console.log(
            'Error in copying shortened url to clipboard, trying to copy original value'
          );
          copyToClipboard(value, navigator)
            .then((copyResp: any) => {
              resolve(copyResp);
            })
            .catch((copyError) => {
              // If neither copying works, then throwing error
              reject(copyError);
            });
        });
    })
    .catch((err) => {
      console.log('Error in shortening url, trying original text', err);
      // Shortening failed, trying to copy original value
      copyToClipboard(value, navigator)
        .then((copyResp: any) => {
          resolve(copyResp);
        })
        .catch((copyError) => {
          reject(copyError);
        });
    });
}
