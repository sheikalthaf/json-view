import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FlowComponent,
  FlowChildComponent,
  FlowConfig,
  Arrangements,
  FitToWindow,
} from '@ngu/flow';
import { EditorComponent } from '@ngu/monaco-editor';
import { JsonParser } from './json-parser';

@Component({
  standalone: true,
  selector: 'app-json',
  imports: [
    FlowComponent,
    FormsModule,
    FlowChildComponent,
    JsonPipe,
    KeyValuePipe,
    EditorComponent,
  ],
  template: `
    <div class="flex w-[25rem] flex-col gap-4 overflow-auto">
      <ngx-monaco-editor
        [options]="editorOptions"
        [(ngModel)]="code"
        (ngModelChange)="updateJson()"
        class="!h-full"
      ></ngx-monaco-editor>
    </div>
    <ngu-flow class="flow flex-1" [config]="config">
      @for (item of parser.lists; track item.id; let i = $index) {
      <div
        [flowChild]="item"
        class="child flex flex-col gap-1 rounded-md border-2 border-gray-300 bg-white p-4"
      >
        @for (values of parser.data[item.id]; track values) {
        <div class=" flex gap-2 relative">
          @if (values[0]) {
          <div class="font-semibold text-purple-700 ">{{ values[0] }}:</div>
          <div class="font-semibold text-gray-600">"{{ values[1] }}"</div>
          } @else {
          <div class="font-semibold text-gray-600">{{ values[1] }}</div>
          } @if (values[2]) {
          <div
            [id]="values[2]"
            class="absolute top-0 -right-5 bg-gray-500 w-2 h-3 bottom-0 m-auto rounded-md"
          ></div>
          }
        </div>
        }
      </div>
      }
    </ngu-flow>
  `,
  styles: `
    .flow {
      background: rgb(238 238 238 / 53%);
    }
    ngu-flow {
      --flow-dot-color: gray;
      --flow-path-color: gray;
      --dot-size: 1px;
    }
    :host {
      background: url(/grid.svg);
      background-repeat: repeat;
      background-size: 73px 73px;
      background-position: top left;
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
  editorOptions = { language: 'json', minimap: { enabled: false } };
  code: string = '';
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

  parser = new JsonParser();

  constructor() {
    this.code = JSON.stringify(this.json, null, 2);
    this.updateList(this.json);
  }

  private updateList(json: Object) {
    this.parser.updateList(json);
    setTimeout(() => {
      this.plugins.arrange.arrange();
    });
  }

  ngOnInit() {}

  updateJson() {
    try {
      const json = JSON.parse(this.code);
      this.updateList(json);
    } catch (e) {
      console.error(e);
    }
  }
}
