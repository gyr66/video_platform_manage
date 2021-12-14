<template>
  <div class="root">
    <el-row>
      <span>请输入URL:</span>
      <el-input v-model="url" style="width: 50%; margin-left: 50px"/>
      <el-button type="primary" style="margin-left: 30px" @click="handleUploadClicked">创建</el-button>
    </el-row>
    <el-row v-if="taskList.length">
      <el-card v-for="(item, index) in taskList" :key="item.id" class="card">
        <div slot="header" class="clearfix">
          <span>任务{{ index + 1 }}</span>
        </div>
        <div class="content">
          <div class="item">
            <span class="task-label">任务id:</span>&nbsp;{{ item.id }}
          </div>
          <div class="item">
            <span class="task-label">任务创建时间:</span>&nbsp;{{ dateFormatter(item.createTime) }}
          </div>
          <div class="item">
            <span class="task-label">任务url:</span>&nbsp;{{ item.url }}
          </div>
          <div class="item">
            <span class="task-label">任务状态:</span>&nbsp;{{ item.status }}
          </div>
          <div class="item" v-if="item.status === '正在执行' && item.msg !== null">
            <span class="task-label">任务执行信息:</span>&nbsp;{{ item.msg }}
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import network from "@/network";
import {dateFormat} from "@/utils";

export default {
  name: "UploadFromUrlView",
  data() {
    return {
      url: '',
      taskList: [],
      runningTaskList: [],
      timer: null
    }
  },
  created() {
    network.get('/task/getAll').then(res => {
      this.taskList = res.content.tasks;
      this.taskList.forEach((val, index) => {
        if (val.status === '正在执行') {
          this.runningTaskList.push({
            item: val,
            index: index
          })
        }
      });
      this.timer = setInterval(this.refreshMsg, 1000);
    })
  },
  methods: {
    handleUploadClicked() {
      network.get('/task/create', {
        params: {
          url: this.url
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
        this.taskList.unshift(res.content.task);
        this.runningTaskList.push({
          item: res.content.task,
          index: 0
        })
      })
    },
    refreshMsg() {
      let taskIds = this.runningTaskList.map(val => val.item.id);
      if (taskIds.length === 0) return;
      network.post('/task/getMsg', {
        taskIds
      }).then(res => {
        let ans = res.content.msgList;
        this.runningTaskList.forEach((val, index) => {
          val.item.msg = ans[index];
          if (val.item.msg == null) {
            val.item.status = '已完成';
            this.runningTaskList.splice(index, 1);
          }
          this.$set(this.taskList, val.index, val.item);
        });
      })
    },
    dateFormatter(val) {
      return dateFormat("YYYY-mm-dd HH:MM:SS", new Date(val));
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  text-align: center;
}

.content {
  text-align: left;
}

.content .item {
  margin-bottom: 10px;
}

.content .item:last-child {
  margin-bottom: 0;
}

.content .item .task-label {
  font-weight: bold;
}

.card {
  width: 50%;
  margin: 0 auto 20px;
}
</style>