export function req<T>(
  u: string,
  method = 'GET',
  sessdata?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    fetch(u, {
      method,
      headers:
        sessdata && sessdata !== '' ? { Cookie: `SESSDATA=${sessdata}` } : {}
    })
      .then(resp => resp.json())
      //@ts-ignore
      .then(resolve)
      .catch(reject);
  });
}

// https://github.com/SocialSisterYi/bilibili-API-collect/blob/7b22c145d25f3ad725fce78c525254ebe60cf673/docs/misc/bvid_desc.md#javascripttypescript
export type BVID = `BV1${string}`;

const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;
const MAX_AID = 1n << 51n;
const BASE = 58n;

const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

export function av2bv(aid: number) {
  const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
  let bvIndex = bytes.length - 1;
  let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
  while (tmp > 0) {
    bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
    tmp = tmp / BASE;
    bvIndex -= 1;
  }
  [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
  [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
  return bytes.join('') as BVID;
}

export function bv2av(bvid: BVID) {
  const bvidArr = Array.from<string>(bvid);
  [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
  [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
  bvidArr.splice(0, 3);
  const tmp = bvidArr.reduce(
    (pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)),
    0n
  );
  return Number((tmp & MASK_CODE) ^ XOR_CODE);
}

export function vid2bv(vid: string): BVID {
  if (vid.toLowerCase().indexOf('av') === 0) return av2bv(Number(vid.slice(2)));
  return vid as BVID;
}
