# assembleHTML
---
**Atomic Design** meets a **Living Styleguide**

Assemble static HTML and the used Atomic Design Patterns with the help of handlebars and assemble.io. It produces a living styleguide on the fly. Based partly on https://github.com/assemble/assemble-pattern-lab by Jon Schlinkert.

Why another Atomic Design boilerplate? Because this one has as less dependencies as possible and most of all, if you generate your code through this tool, you'll have always the same code in your living styleguide as you have in production.


### Installation and usage
- run `npm install`
- run `bower install`to install the vendor files needed
- run `grunt`for a watch task. It compiles SASS files, concatenates the CSS and JS files.
- run `assemble-html`to assemble your .hbs files into static HTML and copy it into the __dist_ folder. It also creates the styleguide files in the __dist_ __styleguide_ folder.
- run `serve`to start the express-server that makes the dynamic styleguide engine work.
- you can visit the style guide at http://localhost:3000/_dist/_styleguide/index.html and your HTML-page at http://localhost:3000/_dist/index.html

### Workflow:
- add component (.hbs)
- add component based .scss-file
- include .scss-file into app.scss
- you can pass the content for the assembled HTML-file via YAML front matter or an external .yml or .json file in the data folder. The external file has to have the same name as the .hbs pattern or template. Global contents can be included into the data.json. It's the default file. Contents for the styleguide go into the data/pattern folder.
- include component into styleguide's config.json
- run grunt assemble-it

### Configure Styleguide
The styleguide files are placed in _templates/_styleguide_ folder. Everything you need to adjust has to be changed here. Te styleguide folder within the __dist_ folder will be overridden every time you run `assemble-html`.

The heart of the sytleguide is the _config.json. Every pattern (atom, molecule, organism) has to be listed here and you can leave a short description for it. That's all you have to do to keep it updated.
To change the theme simply change the CSS within the styleguide.css in the same folder.
```javascript
{
  "title": "Styleguide",
  "intro": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  "content": {

    "atoms": {
      "description": "Atoms are lorem ipsum.",

      "patterns": {
        "button": "This is a simple button"
      }
    },

    "molecules": {
      "description": "<strong>Molecules</strong> are lorem ipsum dolor.",

      "patterns": {
        "buttonLabel": "A Button with a label"
      }
    },

    "organisms": {
      "description": "Organisms are lorem ipsum dolor sit amet.",

      "patterns": {

      }
    }

  }
}
```

##### Notes
- You shouldn't use camel-case naming for handlebars or filenames, because in some cases it confuses the assembler engine.
