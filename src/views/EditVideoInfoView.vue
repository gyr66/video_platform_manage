<template>
  <div class="root">
    <el-table :data="tableData" v-loading="tableLoading"
              element-loading-background="rgba(0, 0, 0, 0)"
              element-loading-text="数据正在加载中"
              element-loading-spinner="el-icon-loading"
              :default-sort="{prop: 'name', order: 'ascending'}"
              @sort-change="handleSortChange">
      <el-table-column align="center" label="视频缩略图">
        <template slot-scope="scope">
          <el-upload
            action="http://localhost:8082/video/updateThumbnail"
            :show-file-list="false"
            :before-upload="beforeThumbnailUpload"
            :on-success="handleThumbnailUploadSuccess"
            :with-credentials="true"
            :data="scope.row"
          >
            <el-image :src="thumbnailUrl[scope.$index]" ref="thumbnail"
                      style="width: 130px; height: 80px"/>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name" sortable="custom"/>
      <el-table-column align="center" label="上传者" prop="uploader" sortable="custom"/>
      <el-table-column align="center" label="上传时间" prop="uploadTime" sortable="custom" :formatter="dateFormatter"/>
      <el-table-column align="center" label="大小" prop="size" sortable="custom" :formatter="sizeFormatter"/>
      <el-table-column align="center">
        <template slot="header">
          <span>标签</span>&nbsp;
          <i class="el-icon-view" @click="filterDialogVisible = true"/>
        </template>
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item" :disable-transitions="true" style="margin: 5px">
            {{ tag(item) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <input
            class="searchInput"
            v-model="searchInput"
            placeholder="输入关键字搜索" style="width: 150px; margin-right: 10px"/>
          <i class="el-icon-search" @click="searchCommitted = searchInput"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handlePreview(scope.row)">预览
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page.sync="currentPage"
      :page-size="5"
      layout="total, prev, pager, next"
      :total="totalVideoCnt"
      @current-change="handleCurrentPageChange"
    >
    </el-pagination>
    <el-dialog title="修改视频信息" :visible.sync="editDialogVisible" :show-close="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form :model="videoInfo">
        <el-form-item label="视频名称">
          <el-input v-model="videoInfo.name" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="视频类型">
          <el-select multiple v-model="videoInfo.tags" placeholder="请选择视频类型" style="width: 200px">
            <el-option v-for="item in tags" :label="item.name" :value="item.id" :key="item.id  "/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="videoInfo.name" :visible.sync="videoPreviewDialogVisible"
               :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handlePreviewClose"
               :destroy-on-close="true">
      <VideoPlayer :video-source="videoInfo.videoUrl" :key="videoInfo.id"/>
    </el-dialog>
    <el-dialog title="标签筛选" :visible.sync="filterDialogVisible" width="30%">
      <div class="dialog-body">
        <el-select multiple v-model="selectedTags" placeholder="请选择标签类型">
          <el-option v-for="item in tags" :label="item.name" :value="item.id" :key="item.id"/>
        </el-select>
        <el-button type="primary" style="margin-left: 25px" @click="handleFilterClicked">筛选</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="videoPreviewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import network from "@/network";
import VideoPlayer from "@/common/VideoPlayer";
import {dateFormat} from "@/utils";
import VideoPlayerTest from "@/common/VideoPlayerTest";

export default {
  name: "EditVideoInfoView",
  // eslint-disable-next-line vue/no-unused-components
  components: {VideoPlayerTest, VideoPlayer},
  inject: ['reload'],
  data() {
    return {
      tableData: [],
      totalVideoCnt: 0,
      editDialogVisible: false,
      videoPreviewDialogVisible: false,
      filterDialogVisible: false,
      videoInfo: {},
      thumbnailUrl: [],
      tags: [],
      currentPage: 1,
      searchInput: '',
      searchCommitted: '',
      selectedTags: [],
      filterCommitted: [],
      tableLoading: false,
      sortProp: 'name',
      sortOrder: 'asc'
    }
  },
  created() {
    network.get('/tag/list').then(res => {
      this.tags = res;
      let temp = []
      this.tags.forEach(item => temp.push(item.id));
      this.filterCommitted = temp;
    });
  },
  computed: {
    tag() {
      return item => {
        for (let i = 0; i < this.tags.length; i++) {
          if (item === this.tags[i].id)
            return this.tags[i].name;
        }
      }
    }
  },
  watch: {
    searchCommitted() {
      this.refreshData(1);
    },
    filterCommitted() {
      this.refreshData(1);
    },
    currentPage(val) {
      this.refreshData(val);
    }
  },
  methods: {
    dateFormatter(row, column, cellValue) {
      return dateFormat("YYYY-mm-dd HH:MM:SS", new Date(cellValue));
    },

    sizeFormatter(row, column, cellValue) {
      return Math.round(cellValue) + 'MB';
    },

    handleEdit(video) {
      this.videoInfo = video;
      this.editDialogVisible = true;
    },

    handleSubmit() {
      network.post("/video/updateInfo", {
        id: this.videoInfo.id,
        name: this.videoInfo.name,
        tags: this.videoInfo.tags
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.editDialogVisible = false;
        } else {
          this.$message.error('修改失败!');
        }
      })
    },

    beforeThumbnailUpload(file) {
      const type = file.type.indexOf('image') !== -1;
      const size = file.size / 1024 / 1024 < 20;
      if (!type) {
        this.$message.error('缩略图格式不符!');
      }
      if (!size) {
        this.$message.error('缩略图大小不能超过20MB!');
      }
      return type && size;
    },

    handleThumbnailUploadSuccess(res, thumbnail) {
      let id = res.content.id;
      let index = -1;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          index = i;
          break;
        }
      }
      this.thumbnailUrl.splice(index, 1, URL.createObjectURL(thumbnail.raw));
      this.$message.success(res.msg);
    },

    handlePreview(video) {
      this.videoInfo = video;
      this.videoPreviewDialogVisible = true;
    },

    handlePreviewClose(done) {
      this.$confirm('是否关闭当前视频?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '关闭视频预览'
        });
        done();
      });
    },

    handleDelete(video) {
      network.delete('/video/delete/' + video.id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功!');
          this.refreshData(this.currentPage);
        }
      });
    },

    refreshData(newPage) {
      this.tableLoading = true;
      network.get('/video/getByCondition', {
        params: {
          page: this.currentPage,
          name: this.searchCommitted,
          tags: this.filterCommitted.join(),
          orderProp: this.sortProp,
          order: this.sortOrder
        }
      }).then(res => {
        this.tableData = res.content.pageInfo.list
        this.currentPage = newPage;
        this.totalVideoCnt = res.content.pageInfo.total;
        this.tableData.forEach((value, index) => this.thumbnailUrl[index] = value.thumbnailUrl);
        this.tableLoading = false;
      });
    },

    handleCurrentPageChange(page) {
      this.currentPage = page;
    },

    handleFilterClicked() {
      this.filterCommitted = this.selectedTags;
      this.filterDialogVisible = false;
    },

    handleSortChange(column) {
      this.sortProp = column.prop;
      this.sortOrder = column.order === 'ascending' ? 'asc' : 'desc';
      this.refreshData(1);
    }
  }
}
</script>

<style scoped>
.el-upload {
  cursor: pointer;
}

.el-pagination {
  text-align: center;
}

.el-icon-search {
  cursor: pointer;
}

.searchInput {
  border: 2px solid lightskyblue;
}

.searchInput:focus {
  outline: 0;
  border: 2px solid lightseagreen;
}

.el-icon-view {
  cursor: pointer;
}

.dialog-body {
  text-align: center;
}


</style>