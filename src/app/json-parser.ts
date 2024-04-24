import { FlowOptions } from '@ngu/flow';
import { BaseParser } from './base-parser';

export class JsonParser extends BaseParser {
  constructor() {
    super();
  }

  override convert(obj: any, id = '', dotId?: string) {
    let uid = this.index.toString();
    this.index++;
    if (Array.isArray(obj)) {
      return this.processArray(obj, id, uid, dotId);
    } else {
      return this.processObject(obj, id, uid, dotId);
    }
  }

  private processObject(obj: any, id: string, uid: string, dotId?: string) {
    let options: FlowOptions[] = [];
    const keys = Object.keys(obj);
    let values: any[] = [];
    for (let key of keys) {
      if (typeof obj[key] === 'object') {
        const dotId = this.makeSafeForCSS(`dot-${uid}-${key}`);
        options.push(...this.convert(obj[key], uid, dotId));
        values.push([
          key,
          Array.isArray(obj[key]) ? '[Array]' : '{Object}',
          dotId,
        ]);
      } else {
        values.push([key, obj[key]]);
      }
    }
    options.push({
      id: uid,
      x: 0,
      y: 0,
      deps: id ? [id] : [],
      dotId,
    });
    this.data[uid] = values;
    return options;
  }

  private processArray(obj: any, id: string, uid: string, dotId?: string) {
    let options: FlowOptions[] = [];
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object') {
        options.push(...this.convert(obj[i], id, dotId));
      } else {
        const uuid = this.makeSafeForCSS(`${id}${i}-${uid}`);
        options.push({ id: uuid, x: 0, y: 0, deps: [id], data: obj[i], dotId });
        this.data[uuid] = [['', obj[i]]];
      }
    }
    return options;
  }
}
