import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import zip from 'rollup-plugin-zip';
import fs from 'fs';
import { createFilter } from '@rollup/pluginutils';
// import replace from '@rollup/plugin-replace';
import modify from 'rollup-plugin-modify'
import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'
import { mkdirSync, rmSync } from 'fs'

// const createZip = (options={}) => {
//   return {
//     name: 'create-zip',
//     writeBundle: async() => {
// 			const fileName = 'bundle.zip'
// 			const ignoreFiles = ['.DS_Store', fileName]
// 			console.log("Generating zip file...")
// 			await zipdir(dist, {saveTo: `${dist}/${fileName}`, filter: (fullPath) => !ignoreFiles.includes(path.basename(fullPath)) })
//     }
//   }
// }

// const rm = (options={}) => {
//   return {
//     name: 'rm',
//     buildEnd: () => {
//       for(let i = 0; i < options.targets.length; i++){
//         console.log(`Deleting ${options.targets[i]}`)
//         rmSync(options.targets[i], { recursive: true })
//       }
//     }
//   }
// }

function replace(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'replace',
    transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const { find, replace } = options;

      if (typeof find === 'string') {
        const regex = new RegExp(find, 'g');
        code = code.replace(regex, replace);
      } else if (find instanceof RegExp) {
        code = code.replace(find, replace);
      } else {
        throw new Error('Invalid find option');
      }

      return {
        code,
        map: null,
      };
    },
  };
}

const mkdir = (options={}) => {
  return {
    name: 'mkdir',
    writeBundle: () => {
      for(let i = 0; i < options.targets.length; i++){
        mkdirSync(options.targets[i], { recursive: true })
      }
    }
  }
}


const postGeneration = {
  input: 'dist/main.js',
  output: {
    file: 'dist/main.js',
  },
  plugins: [
    del({ targets: ['dist/index.d.ts', 'dist/types', 'dist/helpers'] })
  ]
}

const defaultTask = {
  input: 'src/index.ts',
  output: {
    sourcemap: false,
    file: 'dist/main.js',
    format: 'esm',
    name: 'kemuWidget',
  },
  plugins: [
    del({ targets: ['dist/*'] }),
    resolve(),
    typescript(),
    mkdir({ targets: ['dist/assets'] }),
    copy({
      targets: [
        { src: 'src/libs', dest: 'dist/' },
        { src: 'src/icon.svg', dest: 'dist/' },
      ]
    }),
  ],
};

export default [defaultTask,  postGeneration]