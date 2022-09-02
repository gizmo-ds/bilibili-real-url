export const cors_headers: HeadersInit = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST",
};

// https://github.com/SocialSisterYi/bilibili-API-collect/issues/417#issuecomment-1186475063
export class IDUTIL {
  private TABEL = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
  private TR: Record<string, number> = {};
  private S = [11, 10, 3, 8, 4, 6];
  private XOR = 177451812;
  private ADD = 8728348608;
  constructor() {
    const len = this.TABEL.length;
    for (let i = 0; i < len; i++) this.TR[this.TABEL[i]] = i;
  }
  av2bv(av: number) {
    const x_ = (av ^ this.XOR) + this.ADD;
    const r = ["B", "V", "1", , , "4", , "1", , "7"];
    for (let i = 0; i < 6; i++)
      r[this.S[i]] = this.TABEL[Math.floor(x_ / 58 ** i) % 58];
    return r.join("");
  }
  bv2av(bv: string) {
    let r = 0;
    for (let i = 0; i < 6; i++) r += this.TR[bv[this.S[i]]] * 58 ** i;
    return "av" + String((r - this.ADD) ^ this.XOR);
  }
}
