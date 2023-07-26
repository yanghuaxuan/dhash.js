import Hermite from 'hermite-resize';

/* Modifies an existing Canvas context, grayscaling it */
const grayscale = (ctx: OffscreenCanvasRenderingContext2D) => {
  const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }

  ctx.putImageData(imgData, 0, 0);
}

const resize = (ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) => new Promise<void>((resolve) => {
  const hermite = new Hermite();
  const finish_handler = () => {
    resolve();
  }

  hermite.resample(ctx.canvas, width, height, false, finish_handler);
});

const dHash = (path: string, hs = 8) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = path;

      img.addEventListener("load", () => {
        const canvas = new OffscreenCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          grayscale(ctx);
          resize(ctx, hs + 1, hs)
          .then(() => {
            return canvas.convertToBlob()
          })
          .then((e) => {
            console.log(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
            resolve(URL.createObjectURL(e));
          }).catch(e => {
            reject(e);
          });
        }
      });
    })
  }

export default dHash;