import { FlowOptions } from '@ngu/flow';

export abstract class BaseParser {
  lists: FlowOptions[] = [];
  data: Record<string, any[]> = {};
  index = 0;

  updateList(json: Object) {
    this.data = {};
    this.index = 0;
    this.lists = this.convert(json, '', []);
  }

  convert(data: Object, id: string, options: any): any[] {
    return [];
  }

  makeSafeForCSS(name: string) {
    return name.replace(/[^a-z0-9]/g, function (s) {
      var c = s.charCodeAt(0);
      if (c == 32) return '-';
      if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
      return '__' + ('000' + c.toString(16)).slice(-4);
    });
  }
}
