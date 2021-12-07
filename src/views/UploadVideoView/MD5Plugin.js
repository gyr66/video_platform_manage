import {BasePlugin} from '@uppy/core'
import {hash} from "@/utils/hash";
import network from "@/network";

class MD5Plugin extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = 'MD5Plugin';
    this.type = 'processor';
    this.opts = opts;
  }

  /**
   * promise有三个状态
   * pending: 进行中
   * fulfilled: 已完成(resolved)
   * rejected: 已失败
   * promise的状态只能由pending => fulfilled, 或者由pending => rejected, 而且状态一旦改变就不会再变
   * promise.then( )返回的新promise的结果由then()指定的回调函数执行的结果决定
   * 如果抛出异常, 新promise变为rejected, reason为抛出的异常
   * 如果返回的是非promise的任意值, 新promise变为resolved, value为返回的值
   * 如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果
   * catch方法返回一个Promise，而它的行为与catch中的回调函数的返回值有关：
   * 如果catch中的回调函数返回一个值或者没有返回值，那么catch返回的Promise将会成为Resolved状态，并且将返回的值作为Resolved状态的回调函数的参数值。
   * 如果catch中的回调函数抛出一个错误，那么catch返回的Promise将会成为Rejected状态，并且将抛出的错误作为Rejected状态的回调函数的参数值。
   */

  prepareUpload = fileIDs => {
    if (!this.opts.work) return;
    const promises = fileIDs.map(fileID => {
      const file = this.uppy.getFile(fileID);
      this.uppy.emit('preprocess-progress', file, {
        mode: 'indeterminate',
        message: `checking duplicate files...`,
      });
      return hash(file.data).then(md5 => {
        return network.get('/checkExists', {
          params: {
            hash: md5
          }
        })
    }).then(res => {
        let flag = res.content.exist;
        let hash = res.content.hash;
        if (flag) {
          this.uppy.info(`${file.name}已存在，上传取消!`);
          this.uppy.removeFile(fileID);
        } else {
          this.uppy.setFileMeta(fileID, {
            hash: hash
          });
        }
      }).catch(err => {
        this.uppy.log(`[MD5Checker] Failed to check ${file.name}:`, 'warning')
        this.uppy.log(err, 'warning')
      })
    })

    const emitPreprocessCompleteForAll = () => {
      this.uppy.emit('preprocess-complete', this.uppy.getFiles())
    }

    return Promise.all(promises)
      .then(emitPreprocessCompleteForAll)
  }

  install() {
    this.uppy.addPreProcessor(this.prepareUpload)
  }

  uninstall() {
    this.uppy.removePreProcessor(this.prepareUpload)
  }
}

export default MD5Plugin