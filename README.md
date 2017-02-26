# webgl boierplate

Webgl development greatly benefits from Typescripts type annotations. Moreover, webpack provides sufficient hooks to import non-js dependencies: not just css, but also
glsl (the shader language). There is a simple glsl loader for webpack that allows one to define shader code in seperate files, instead of having to 
emebed them into html script tags. Finally, the glslx extension for VScode gives one elementary syntax highlighting in these .glsl files.

So is webpack + tsc + vscode a golden combination?

Not out of the box ... Typescript allows for great intellisense on CanvasContexts and the GL object; but its import is not as liberal as the one from babel 
(the latter transforms anything whatsover in a commonjs require). If the import is not from a ts file, e.g. a glsl file, tsc will break with a compilation error.

The key solution follows a hint in the [ts-loader readme](https://github.com/TypeStrong/ts-loader#loading-other-resources-and-code-splitting): the way to make "require's" in typescript to non-ts resources is to 
create a declaration in a d.ts file for a  require function, that will make all tsc complaints go away. 