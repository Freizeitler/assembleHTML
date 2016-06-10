# assembleHTML
---
**Atomic Design** meets a **Living Styleguide**

Assemble static HTML and the used Atomic Design Patterns with the help of handlebars and assemble.io. It produces a living styleguide on the fly. Based partly on https://github.com/assemble/assemble-pattern-lab by Jon Schlinkert


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

##### Notes
- You shouldn't use camel-case naming for handlebars or filenames, because in some cases it confuses the assembler engine.
