/**
 * CommonJS模块规范和ES6模块规范
 * require: node 和 es6 都支持的引入
 * export / import : 只有es6 支持的导出引入
 * module.exports / exports: 只有 node 支持的导出
 * export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系,即import{ '对应名称1'，'对应名称2'} from ’api‘。
 *
 */
const SparkMD5 = require('spark-md5')

export function hash(file) {
  return new Promise((resolve, reject) => {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 2097152,
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    fileReader.onload = e => {
      spark.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) loadNext();
      else resolve(spark.end());
    }

    fileReader.onerror = () => {
      reject('计算MD5失败!');
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  })
}


