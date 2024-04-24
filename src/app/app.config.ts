import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxMonacoEditorConfig, provideMonacoEditor } from '@ngu/monaco-editor';

declare var monaco: any;

export function onMonacoLoad() {
  const uri = monaco.Uri.parse('a://b/foo.json');
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: 'http://myserver/foo-schema.json',
        fileMatch: [uri.toString()],
        schema: {
          type: 'object',
          properties: {
            p1: {
              enum: ['v1', 'v2'],
            },
            p2: {
              $ref: 'http://myserver/bar-schema.json',
            },
          },
        },
      },
      {
        uri: 'http://myserver/bar-schema.json',
        fileMatch: [uri.toString()],
        schema: {
          type: 'object',
          properties: {
            q1: {
              enum: ['x1', 'x2'],
            },
          },
        },
      },
    ],
  });
}

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: { scrollBeyondLastLine: false, theme: 'vs-light' },
  onMonacoLoad,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideMonacoEditor(monacoConfig),
  ],
};
