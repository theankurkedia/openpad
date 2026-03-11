async function getShortenedUrl(url: string): Promise<string> {
  const response = await fetch(
    `/api/shorten?url=${encodeURIComponent(url)}`
  );
  if (!response.ok) {
    throw new Error(`Shorten API error: ${response.status}`);
  }
  return response.text();
}

async function copyToClipboard(
  value: string,
  navigator: Navigator
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    navigator.clipboard.writeText(value).then(
      () => {
        console.log('Url copied successfully');
        resolve(value);
      },
      (error: Error) => {
        console.log('Error in copying url');
        reject(value);
      }
    );
  });
}

export function shortenAndCopyUrl(
  value: string,
  navigator: Navigator,
  resolve: (value: string) => void,
  reject: (value: string) => void
) {
  getShortenedUrl(value)
    .then((resp: string) => {
      // If shorten success, trying to copy it to clipboard
      copyToClipboard(resp, navigator)
        .then((copyResp: string) => {
          resolve(copyResp);
        })
        .catch((error) => {
          // If error in copying shortened url, trying to copy original value
          console.log(
            'Error in copying shortened url to clipboard, trying to copy original value'
          );
          copyToClipboard(value, navigator)
            .then((copyResp: string) => {
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
        .then((copyResp: string) => {
          resolve(copyResp);
        })
        .catch((copyError) => {
          reject(copyError);
        });
    });
}
