import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, afterNextRender, viewChild } from '@angular/core';
import {
  FlowComponent,
  FlowChildComponent,
  FlowOptions,
  FlowConfig,
  Arrangements,
  FitToWindow,
} from '@ngu/flow';

@Component({
  standalone: true,
  selector: 'app-json',
  imports: [
    FlowComponent,
    FlowChildComponent,
    JsonPipe,
    KeyValuePipe,
  ],
  template: `
    <div class="flex w-[25rem] flex-col gap-4 overflow-auto p-4">
      <pre
        contenteditable="true"
        class="text-balance"
        (input)="updateJson($event)"
      >
 {{ json | json }}
 </pre
      >
    </div>
    <ngu-flow class="flow flex-1" [config]="config">
      @for (item of lists; track item.id; let i = $index) {
        <div
          [flowChild]="item"
          class="child flex flex-col gap-1 rounded-md border-2 border-gray-300 bg-white p-4"
        >
          @for (ob of data[item.id]; track ob) {
            <div class=" flex gap-2">
              @if (ob[0]) {
                <div class="font-semibold text-purple-700 ">{{ ob[0] }}:</div>
                <div class="font-semibold text-gray-600">"{{ ob[1] }}"</div>
              } @else {
                <div class="font-semibold text-gray-600">{{ ob[1] }}</div>
              }
            </div>
          }
        </div>
      }
    </ngu-flow>
  `,
  styles: `
    .flow {
      min-height: 90vh;
      background: #eee;
    }
    ngu-flow {
      --flow-dot-color: gray;
      --flow-path-color: gray;
      --dot-size: 1px;
    }
  `,
  host: {
    class: 'flex',
  },
})
export class JsonComponent implements OnInit {
  flow = viewChild(FlowComponent);
  plugins = {
    fitToWindow: new FitToWindow(true),
    arrange: new Arrangements(),
  };
  config: FlowConfig = {
    Arrows: true,
    ArrowSize: 20,
    Plugins: this.plugins,
    ChildDragging: false,
  };
  json = {
    squadName: 'Super hero squad',
    homeTown: 'Metro City',
    formed: 2016,
    secretBase: 'Super tower',
    active: true,
    members: [
      {
        name: 'Molecule Man',
        age: 29,
        secretIdentity: 'Dan Jukes',
        powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast'],
      },
      {
        name: 'Madame Uppercut',
        age: 39,
        secretIdentity: 'Jane Wilson',
        powers: [
          'Million tonne punch',
          'Damage resistance',
          'Superhuman reflexes',
        ],
      },
      {
        name: 'Eternal Flame',
        age: 1000000,
        secretIdentity: 'Unknown',
        powers: [
          'Immortality',
          'Heat Immunity',
          'Inferno',
          'Teleportation',
          'Interdimensional travel',
        ],
      },
    ],
  };
  lists: FlowOptions[] = [
    { id: '1', x: 0, y: 0, deps: [] },
    { id: '2', x: 0, y: 0, deps: ['1'] },
  ];
  data: Record<string, any[]> = {};
  index = 0;

  constructor() {
    this.updateList(this.json);
    console.log(this.lists, this.data);
    afterNextRender(() => {
      console.log(this.lists, this.data);
    });
  }

  private updateList(json: Object) {
    this.data = {};
    this.index = 0;
    this.lists = this.convertJsonToFlowOptions(json, '', []);
    setTimeout(() => {
      this.plugins.arrange.arrange();
    });
  }

  ngOnInit() {}

  updateJson(event: any) {
    try {
      console.log(event.target.innerText);
      const json = JSON.parse(event.target.innerText);
      this.updateList(json);
    } catch (e) {
      console.error(e);
    }
  }

  convertJsonToFlowOptions(obj: any, id = '', op: any) {
    let options: FlowOptions[] = [];
    let uid = this.index.toString();
    this.index++;
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'object') {
          options.push(...this.convertJsonToFlowOptions(obj[i], id, options));
        } else {
          const iv = `${id}${i}-${uid}`;
          options.push({ id: iv, x: 0, y: 0, deps: [id] });
          this.data[iv] = [['', obj[i]]];
        }
      }
      return options;
    }
    const keys = Object.keys(obj);
    let ob: any[] = [];
    options.push({ id: uid, x: 0, y: 0, deps: id ? [id] : [] });
    for (let key of keys) {
      if (typeof obj[key] === 'object') {
        const iv = `${id}${key}-${this.index}`;
        options.push({ id: iv, x: 0, y: 0, deps: [uid] });
        this.data[iv] = [['', key]];
        options.push(...this.convertJsonToFlowOptions(obj[key], iv, options));
      } else {
        ob.push([key, obj[key]]);
      }
    }
    this.data[uid] = ob;
    return options;
  }
}
