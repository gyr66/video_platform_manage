<template>
  <div class="root">
    <div class="el-row">
      <el-input placeholder="请输入标签名称" v-model="input" style="width: 200px; margin-right: 50px"/>
      <el-button type="success" @click="handleAddButtonClicked">新增</el-button>
    </div>
    <div class="el-row">
      <div v-for="item in tags" :key="item.id" class="tag">
        <el-popconfirm
          confirm-button-text='确定'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          :title="'确定删除' + item.name + '吗?'"
          :key="item.id"
          @confirm = handleDeleteConfirm(item)
        >
          <el-button type="primary" slot="reference" class="term">{{ item.name }}</el-button>
        </el-popconfirm>
      </div>
    </div>

  </div>
</template>

<script>


import network from "@/network";

export default {
  name: "TagManageView",
  data() {
    return {
      tags: [],
      input: ''
    }
  },
  created() {
    network.get('/tag/list').then(res => {
      this.tags = res;
    });
  },
  methods: {
    handleAddButtonClicked() {
      if (!this.input) this.$message.warning('输入不能为空!');
      network.get('/tag/add', {
        params: {
          name: this.input
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.tags.push({
            id: res.content.tag.id,
            name: res.content.tag.name
          })
        }
      });
    },
    handleDeleteConfirm(tag) {
      network.delete('/tag/delete/' + tag.id).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < this.tags.length; i++) {
            if (this.tags[i].id === tag.id) {
              this.tags.splice(i, 1);
            }
          }
          this.$message.success(res.msg);
        } else {
          this.$message.error("删除失败!");
        }
      })
    },

  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.tag {
  display: inline;
}

.term {
  margin: 5px;
}


</style>