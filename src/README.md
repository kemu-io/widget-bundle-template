# Kemu Widget Bundle
Widget bundles allow you to package full applications to run inside of a Kemu as a Custom Widget that you can then save to your collections, share it and use it in multiple recipes.

This template provides the basic structure to help you get started. The code in `index.ts` is the widget's processor and contains all the main logic. 

In this example, this widget behaves as an addition widget, it exposes two inputs and one output port, and adds up any number that arrives at its inputs, sending the result to the next widget via its output port.

# Structure Of A Widget Bundle

```txt
<root>
  |- main.ts            <== widget's processor
  |- icon.svg           <== this is what users will see when the bundle is added to the Logic Mapper.
  |- libs               <== add your runtime dependencies. This are files that can be loaded at runtime.
   \
    |- ml-model-abc.json
    |- ml-model-abc.bin
  |- helpers            <== place all your dependencies here. The code will be package along with main.ts 
    \                       into a single `main.js` file.
    |- dep-lib-123.ts
    |- dep-lib-456.ts
  |- assets             <== created during build time. Don't put dependencies here, users will have 
                            access to this folder.
```

# Setup Your Development Environment
```sh
npm install
```

# Building Your Bundle

```sh
npm run build
```

It should generate a `dist` folder with:
```txt
- main.js   <== widget's processor and dependencies bundled into a single file
- assets
- libs
- icon.svg
```

# How To Add This Bundle To Kemu?
Simply zip all the files in the `dist` folder and drop it into the Widget Bundle modal in the Logic Mapper.